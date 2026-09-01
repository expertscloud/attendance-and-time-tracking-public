import { config } from '@/config/config';
import { formatDuration, getFormattedDate } from '@/utils/helpers';
import { ATTENDANCE_HIGHLIGHT_COLORS } from '@/utils/constants';
import dayjs from 'dayjs';

export const getDateKeys = ({ startDate, endDate } = {}) => {
  const keys = [];
  if (!startDate || !endDate) return keys;
  const end = dayjs(endDate);
  for (let d = dayjs(startDate); !d.isAfter(end); d = d.add(1, 'day')) {
    keys.push(d.format('YYYY-MM-DD'));
  }
  return keys.reverse();
};

const checkIsUserIdle = (data, todayKey) => {
  const att = todayKey && data?.[todayKey];
  if (
    att &&
    att.status !== 'completed' &&
    att.updatedAt &&
    dayjs().diff(dayjs(att.updatedAt), 'minute') >= config.attendanceUpdateThresholdInMinutes
  ) {
    return att;
  }
};

const getWorkingSeconds = value => {
  if (!value?.checkIn) return null;
  if (typeof value.totalWorkingSeconds === 'number') return value.totalWorkingSeconds;
  if (value.checkOut) return dayjs(value.checkOut).diff(dayjs(value.checkIn), 'second');
  return null;
};

const getShortWorkingTimeBackground = value => {
  if (!value?.checkOut) return null;
  const workingSeconds = getWorkingSeconds(value);
  if (workingSeconds === null) return null;
  if (workingSeconds < config.warningShortDayHours * 3600) return ATTENDANCE_HIGHLIGHT_COLORS.shortDayWarning;
  if (workingSeconds < config.mildShortDayHours * 3600) return ATTENDANCE_HIGHLIGHT_COLORS.shortDayMild;
  return null;
};

const workingDurationComparator = (valueA, valueB) => {
  const a = getWorkingSeconds(valueA);
  const b = getWorkingSeconds(valueB);
  if (a === b) return 0;
  if (a === null) return -1;
  if (b === null) return 1;
  return a - b;
};

export const buildAttendanceColumnDefs = (dateKeys = []) => {
  const today = dayjs().format('YYYY-MM-DD');
  const todayKey = dateKeys.includes(today) ? today : null;

  return [
    {
      headerName: 'Name',
      colId: 'fullName',
      field: 'fullName',
      pinned: 'left',
      width: 200,
      cellStyle: ({ data }) => (checkIsUserIdle(data, todayKey) ? { backgroundColor: ATTENDANCE_HIGHLIGHT_COLORS.idle } : null),
      tooltipValueGetter: ({ data }) => {
        const attr = checkIsUserIdle(data, todayKey);
        if (attr) {
          const idleSeconds = dayjs().diff(dayjs(attr.updatedAt), 'second');
          return `Last Active: ${getFormattedDate(attr.updatedAt, true, true)}\n  Idle Since: ${formatDuration(idleSeconds, true)}`;
        }
        return null;
      },
    },
    ...dateKeys.map((dateKey, idx) => ({
      headerName: getFormattedDate(dateKey),
      colId: dateKey,
      field: dateKey,
      minWidth: 150,
      ...(idx === 0 && { pinned: 'left', flex: 0, width: 170 }),
      comparator: workingDurationComparator,
      cellRenderer: 'AttendanceCellRenderer',
      valueFormatter: ({ value }) => (value?.checkIn ? 'P' : ''),
      cellStyle: ({ value }) => {
        const shortWorkingTimeBackground = getShortWorkingTimeBackground(value);
        return {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ...(shortWorkingTimeBackground && { backgroundColor: shortWorkingTimeBackground }),
        };
      },
    })),
  ];
};
