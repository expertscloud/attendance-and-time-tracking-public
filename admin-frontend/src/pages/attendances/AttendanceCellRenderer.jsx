import { useSelector } from 'react-redux';
import { Box, Typography, Chip, Tooltip } from '@mui/material';
import { formatDuration, getFormattedDate, getWeekendLabel, isHolidayType } from '@/utils/helpers';

const AttendanceCellRenderer = ({ value, colDef }) => {
  const leaveTypeEnum = useSelector(state => state.MasterData.leaveTypeEnum);

  if (value?.leave) {
    const typeInfo = leaveTypeEnum?.[value.leave.leaveType];
    const isHoliday = isHolidayType(value.leave.leaveType);
    const leaveLabel = typeInfo?.label || 'Leave';
    const label = isHoliday ? value.leave.reason || leaveLabel : leaveLabel;
    const tooltip = value.leave.reason ? (isHoliday ? value.leave.reason : `${leaveLabel}: ${value.leave.reason}`) : leaveLabel;
    const leaveColor = typeInfo?.color;

    return (
      <Tooltip title={tooltip} arrow placement="top">
        <Chip
          label={label}
          size="small"
          sx={{
            fontWeight: 'bold',
            maxWidth: '100%',
            bgcolor: leaveColor,
            color: '#ffffff',
            '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' },
          }}
        />
      </Tooltip>
    );
  }

  if (value?.checkIn) {
    return (
      <Box>
        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
          {getFormattedDate(value.checkIn, true, true)} &rarr; {getFormattedDate(value.checkOut, true, true)}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', color: 'primary.main', textAlign: 'center' }}>
          {formatDuration(value.totalWorkingSeconds)}
        </Typography>
      </Box>
    );
  }

  const weekendLabel = getWeekendLabel(colDef?.colId);
  if (weekendLabel) {
    return <Typography sx={{ fontWeight: 600, color: 'text.secondary', textAlign: 'center' }}>{weekendLabel}</Typography>;
  }

  return (
    <Typography variant="h6" sx={{ fontWeight: 500, color: 'error.main', textAlign: 'center' }}>
      A
    </Typography>
  );
};

export default AttendanceCellRenderer;
