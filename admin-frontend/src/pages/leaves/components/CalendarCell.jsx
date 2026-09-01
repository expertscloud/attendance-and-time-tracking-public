import { Box, Chip, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useSelector } from 'react-redux';

const CalendarCell = ({ day, leave, isWeekend, color, compact = false }) => {
  const leaveTypeEnum = useSelector(state => state.MasterData.leaveTypeEnum);
  const leaveLabel = leaveTypeEnum?.[leave?.leaveType]?.label || 'Leave';
  color = leaveTypeEnum?.[leave?.leaveType]?.color;

  if (compact) {
    const bgColor = leave ? color : isWeekend ? 'action.hover' : 'transparent';
    const textColor = leave ? 'primary.contrastText' : isWeekend ? 'text.disabled' : 'text.primary';

    const cell = (
      <Box
        sx={{
          aspectRatio: '1/1',
          width: '100%',
          borderRadius: 1,
          border: leave ? 'none' : '1px solid',
          borderColor: 'divider',
          bgcolor: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: leave ? 'pointer' : 'default',
          '&:hover': { opacity: leave ? 0.8 : 1, bgcolor: !leave && !isWeekend ? 'action.focus' : bgColor },
        }}
      >
        <Typography variant="caption" color={textColor} sx={{ fontWeight: leave ? 'bold' : 500 }}>
          {day}
        </Typography>
      </Box>
    );

    return leave ? (
      <Tooltip title={`${leaveLabel}: ${leave.reason || 'No reason provided'}`} arrow placement="top">
        {cell}
      </Tooltip>
    ) : (
      cell
    );
  }

  const bgColor = leave ? alpha(color, 0.15) : isWeekend ? 'action.hover' : 'background.paper';

  return (
    <Box
      sx={{
        minHeight: 120,
        p: 1.5,
        borderRadius: 2,
        border: '1px solid',
        borderColor: leave ? color : 'divider',
        bgcolor: bgColor,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        transition: 'background-color 0.2s',
        '&:hover': {
          bgcolor: leave ? alpha(color, 0.25) : isWeekend ? 'action.hover' : 'action.focus',
        },
      }}
    >
      <Typography
        variant="body1"
        color={leave ? color : isWeekend ? 'text.disabled' : 'text.primary'}
        sx={{ fontWeight: leave ? 'bold' : 500 }}
      >
        {day}
      </Typography>

      {isWeekend ? (
        <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 'medium', mt: 'auto' }}>
          Weekend
        </Typography>
      ) : null}

      {leave ? (
        <>
          <Chip
            label={leaveLabel}
            size="small"
            sx={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: '0.7rem', backgroundColor: color, color: 'common.white' }}
          />
          {leave.reason ? (
            <Typography variant="caption" color="text.secondary" title={leave.reason} sx={{ mt: 'auto' }}>
              {leave.reason}
            </Typography>
          ) : null}
        </>
      ) : null}
    </Box>
  );
};

export default CalendarCell;
