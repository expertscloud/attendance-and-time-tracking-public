import { Button } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ExcelJS from 'exceljs';
import dayjs from 'dayjs';
import { isWeekendDate, getWeekendLabel, downloadFile, isHolidayType } from '@/utils/helpers';
import { config } from '@/config/config';
import store from '@/store/store';

/** Convert '#rrggbb' → 'FFrrggbb' (ARGB format for ExcelJS) */
const hexToArgb = hex => 'FF' + hex.replace('#', '').toUpperCase();

// ─── Constants ────────────────────────────────────────────────────────────────

const LAYOUT = {
  firstDataRow: 5, // Row where user data begins
  firstDateCol: 4, // Column D — where date columns start
  metricsPerUser: 5, // Rows per user: check-in, check-out, total, break, work
  rowHeights: { title: 24, header: 20 },
  colWidths: { name: 24, email: 28, metric: 14, date: 9 },
};

// Thresholds from config (converted to seconds)
const WARNING_SECS = config.warningShortDayHours * 3600; // e.g. 4h → red
const MILD_SECS = config.mildShortDayHours * 3600; // e.g. 6h → orange

const METRIC_LABELS = ['Check In', 'Check Out', 'Total Hours', 'Break', 'Work Hours'];

// ─── Styles ───────────────────────────────────────────────────────────────────

const thinBorder = {
  top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
  left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
  bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
  right: { style: 'thin', color: { argb: 'FFD0D0D0' } },
};

/** Heavy bottom edge closing out a user's 5-row block, so blocks read as groups */
const userSeparatorBorder = {
  ...thinBorder,
  bottom: { style: 'medium', color: { argb: 'FF003B96' } },
};

const fills = {
  header: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003B96' } },
  // Alternating tint banding every other user's block
  userBand: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEF3FB' } },
  userBandMetric: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE3EBF7' } },
  weekend: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFEFEF' } },
  absent: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEBEE' } },
  metric: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F9FA' } },
  shortDayWarn: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9534F' } },
  shortDayMild: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE0B2' } },
};

const fonts = {
  title: { name: 'Calibri', size: 16, bold: true },
  header: { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } },
  bold10: { name: 'Calibri', size: 10, bold: true },
  normal: { name: 'Calibri', size: 9.5 },
  bold: { name: 'Calibri', size: 9.5, bold: true },
  weekend: { name: 'Calibri', size: 9.5, bold: true, color: { argb: 'FF666666' } },
  absent: { name: 'Calibri', size: 9.5, bold: true, color: { argb: 'FFC62828' } },
  // Work-row fonts — sized up + darkened so the row reads heavier than its neighbours
  shortDayWarn: { name: 'Calibri', size: 10.5, bold: true, color: { argb: 'FFFFFFFF' } },
  shortDayMild: { name: 'Calibri', size: 10.5, bold: true, color: { argb: 'FF5C3400' } },
  normalDay: { name: 'Calibri', size: 10.5, bold: true, color: { argb: 'FF000000' } },
};

const alignments = {
  center: { horizontal: 'center', vertical: 'middle' },
  left: { horizontal: 'left', vertical: 'middle' },
  right: { horizontal: 'right', vertical: 'middle' },
  centerWrap: { horizontal: 'center', vertical: 'middle', wrapText: true },
};

// ─── Cell Helpers ─────────────────────────────────────────────────────────────

const setCell = (worksheet, row, col, { value, fill, font, alignment }) => {
  const cell = worksheet.getCell(row, col);
  cell.value = value;
  if (fill) cell.fill = fill;
  if (font) cell.font = font;
  if (alignment) cell.alignment = alignment;
};

const mergeAndStyleCell = (worksheet, startRow, endRow, colNum, style) => {
  worksheet.mergeCells(startRow, colNum, endRow, colNum);
  setCell(worksheet, startRow, colNum, style);
};

const applyBorderToRange = (worksheet, startRow, startCol, endRow, endCol) => {
  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      worksheet.getCell(r, c).border = thinBorder;
    }
  }
};

/**
 * Single styling pass over one user's block: borders the range, closes it with a
 * heavy rule, and tints untouched cells on banded users. Only cells with no fill
 * of their own get the band, so weekend/leave/absent/short-day colours survive —
 * and merged cells report their master's fill, so they're skipped automatically.
 */
const decorateUserBlock = (worksheet, startRow, endRow, endCol, isBanded) => {
  for (let r = startRow; r <= endRow; r++) {
    for (let c = 1; c <= endCol; c++) {
      const cell = worksheet.getCell(r, c);
      cell.border = r === endRow ? userSeparatorBorder : thinBorder;
      if (isBanded && !cell.fill) cell.fill = fills.userBand;
    }
  }
};

// ─── Time Helpers ─────────────────────────────────────────────────────────────

const formatSecondsToHHMM = seconds => {
  const total = Number(seconds);
  if (!Number.isFinite(total) || total <= 0) return '0:00';
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  return `${hrs}:${String(mins).padStart(2, '0')}`;
};

// ─── Attendance Helpers ───────────────────────────────────────────────────────

const getAttendanceState = (dateKey, value) => {
  if (isWeekendDate(dateKey) && !value?.checkIn && !value?.leave) return 'weekend';
  if (value?.leave) return 'leave';
  if (!value?.checkIn) return 'absent';
  return 'present';
};

const calcAttendanceTimes = value => {
  const checkIn = dayjs(value.checkIn);
  const checkOut = value.checkOut ? dayjs(value.checkOut) : null;
  const totalSecs = checkOut ? checkOut.diff(checkIn, 'second') : 0;
  const workSecs = value.totalWorkingSeconds ?? 0;
  return {
    checkInTime: checkIn.format('HH:mm'),
    checkOutTime: checkOut ? checkOut.format('HH:mm') : '-',
    totalSecs,
    workSecs,
    breakSecs: Math.max(0, totalSecs - workSecs),
  };
};

// ─── Attendance Cell Renderers ────────────────────────────────────────────────

const renderWeekendCell = ({ worksheet, startRow, endRow, colNum, dateKey }) => {
  mergeAndStyleCell(worksheet, startRow, endRow, colNum, {
    value: getWeekendLabel(dateKey) || 'Weekend',
    fill: fills.weekend,
    font: fonts.weekend,
    alignment: alignments.center,
  });
};

const renderLeaveCell = ({ worksheet, startRow, endRow, colNum, value, leaveTypeEnum }) => {
  const typeData = leaveTypeEnum?.[value.leave.leaveType];
  const name = typeData?.label || 'Leave';

  const isHoliday = isHolidayType(value.leave.leaveType);
  const label = isHoliday ? value.leave.reason || name : name;
  const argb = hexToArgb(typeData?.color || '#888888');

  mergeAndStyleCell(worksheet, startRow, endRow, colNum, {
    value: label,
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb } },
    font: { name: 'Calibri', size: 9.5, bold: true, color: { argb: 'FFFFFFFF' } },
    alignment: alignments.centerWrap,
  });
};

const renderAbsentCell = ({ worksheet, startRow, endRow, colNum }) => {
  mergeAndStyleCell(worksheet, startRow, endRow, colNum, {
    value: 'Absent',
    fill: fills.absent,
    font: fonts.absent,
    alignment: alignments.center,
  });
};

const getShortDayStyle = totalSecs => {
  if (totalSecs < WARNING_SECS) return { fill: fills.shortDayWarn, font: fonts.shortDayWarn };
  if (totalSecs < MILD_SECS) return { fill: fills.shortDayMild, font: fonts.shortDayMild };
  return { fill: null, font: fonts.normalDay };
};

const renderPresentCell = ({ worksheet, startRow, colNum, value }) => {
  const { checkInTime, checkOutTime, totalSecs, workSecs, breakSecs } = calcAttendanceTimes(value);
  const { fill: workFill, font: workFont } = getShortDayStyle(workSecs);

  const rows = [
    { value: checkInTime, font: fonts.normal, fill: null },
    { value: checkOutTime, font: fonts.normal, fill: null },
    { value: formatSecondsToHHMM(totalSecs), font: fonts.normal, fill: null },
    { value: formatSecondsToHHMM(breakSecs), font: fonts.normal, fill: null },
    { value: formatSecondsToHHMM(workSecs), font: workFont, fill: workFill },
  ];

  rows.forEach(({ value: cellValue, font, fill }, offset) => {
    setCell(worksheet, startRow + offset, colNum, { value: cellValue, font, fill, alignment: alignments.center });
  });
};

const renderAttendanceColumn = ({ worksheet, startRow, endRow, colNum, dateKey, value, leaveTypeEnum }) => {
  const state = getAttendanceState(dateKey, value);
  const ctx = { worksheet, startRow, endRow, colNum, dateKey, value, leaveTypeEnum };
  switch (state) {
    case 'weekend':
      return renderWeekendCell(ctx);
    case 'leave':
      return renderLeaveCell(ctx);
    case 'absent':
      return renderAbsentCell(ctx);
    case 'present':
      return renderPresentCell(ctx);
  }
};

// ─── Header Rendering ─────────────────────────────────────────────────────────

const createReportHeader = (worksheet, dateKeys, title) => {
  worksheet.getRow(1).height = LAYOUT.rowHeights.title;
  worksheet.getRow(3).height = LAYOUT.rowHeights.header;
  worksheet.getRow(4).height = LAYOUT.rowHeights.header;

  setCell(worksheet, 1, 1, { value: title, font: fonts.title });

  const fixedCols = [
    { ref: 'A3:A4', value: 'Employee Name', col: 'A', width: LAYOUT.colWidths.name },
    { ref: 'B3:B4', value: 'Email', col: 'B', width: LAYOUT.colWidths.email },
    { ref: 'C3:C4', value: 'Activities', col: 'C', width: LAYOUT.colWidths.metric },
  ];
  fixedCols.forEach(({ ref, value, col, width }) => {
    worksheet.mergeCells(ref);
    const cell = worksheet.getCell(ref.split(':')[0]);
    cell.value = value;
    cell.fill = fills.header;
    cell.font = fonts.header;
    cell.alignment = alignments.center;
    worksheet.getColumn(col).width = width;
  });

  dateKeys.forEach((dateKey, i) => {
    const colNum = LAYOUT.firstDateCol + i;
    const d = dayjs(dateKey);
    setCell(worksheet, 3, colNum, { value: d.format('D/M'), fill: fills.header, font: fonts.header, alignment: alignments.center });
    setCell(worksheet, 4, colNum, { value: d.format('ddd'), fill: fills.header, font: fonts.header, alignment: alignments.center });
    worksheet.getColumn(colNum).width = LAYOUT.colWidths.date;
  });

  applyBorderToRange(worksheet, 3, 1, 4, 3 + dateKeys.length);
};

// ─── User Rendering ───────────────────────────────────────────────────────────

const renderUserSection = (worksheet, user, userIdx, dateKeys, leaveTypeEnum) => {
  const startRow = LAYOUT.firstDataRow + userIdx * LAYOUT.metricsPerUser;
  const endRow = startRow + LAYOUT.metricsPerUser - 1;
  const isBanded = userIdx % 2 === 1;

  mergeAndStyleCell(worksheet, startRow, endRow, 1, {
    value: user?.fullName || user?.user?.fullName || '',
    font: fonts.bold10,
    alignment: alignments.left,
  });
  mergeAndStyleCell(worksheet, startRow, endRow, 2, {
    value: user?.email || user?.user?.email || '',
    font: fonts.bold10,
    alignment: alignments.left,
  });

  METRIC_LABELS.forEach((label, idx) => {
    setCell(worksheet, startRow + idx, 3, {
      value: label,
      fill: isBanded ? fills.userBandMetric : fills.metric,
      font: fonts.bold,
      alignment: alignments.right,
    });
  });

  dateKeys.forEach((dateKey, i) => {
    renderAttendanceColumn({ worksheet, startRow, endRow, colNum: LAYOUT.firstDateCol + i, dateKey, value: user[dateKey], leaveTypeEnum });
  });

  decorateUserBlock(worksheet, startRow, endRow, 3 + dateKeys.length, isBanded);
};

// ─── Export Orchestrator ──────────────────────────────────────────────────────

const exportAttendanceExcel = async ({ users, dateKeys }) => {
  const leaveTypeEnum = store.getState()?.MasterData?.leaveTypeEnum;
  const endDate = dateKeys[0];
  const startDate = dateKeys[dateKeys.length - 1];
  const filename = `tickly-attendance-${startDate}-to-${endDate}`;
  const title = `Tickly Attendance ${startDate} to ${endDate}`;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(filename);
  // Freeze the identity columns (A–C) and header rows so the user a row belongs to
  // stays visible while scrolling far right / far down
  worksheet.views = [{ state: 'frozen', xSplit: 3, ySplit: 4, showGridLines: true }];

  createReportHeader(worksheet, dateKeys, title);
  users.forEach((user, idx) => renderUserSection(worksheet, user, idx, dateKeys, leaveTypeEnum));

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  downloadFile(blob, `${filename}.xlsx`);
};

// ─── Component ────────────────────────────────────────────────────────────────

const ExportExcel = ({ users = [], dateKeys = [] }) => {
  return (
    <Button
      size="small"
      variant="outlined"
      startIcon={<FileDownloadOutlinedIcon />}
      onClick={() => exportAttendanceExcel({ users, dateKeys })}
      disabled={!users.length || !dateKeys.length}
    >
      Export Excel
    </Button>
  );
};

export default ExportExcel;
