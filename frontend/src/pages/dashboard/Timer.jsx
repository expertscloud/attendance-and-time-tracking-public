import { useState } from 'react';
import { Box, Button, Paper, Stack, Tooltip, Typography } from '@mui/material';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StatusChip from '@/shared/StatusChip';
import { useSelector } from 'react-redux';
import { checkIn, pauseTimer, resumeTimer } from './AttendanceApiCalls';
import { attendanceStatus } from '@/utils/constants';
import { getFormattedDate } from '@/utils/helpers';
import WorkDetail from './WorkDetail';
import ElapsedCounter from './ElapsedCounter';
import TimerProgressRing from './TimerProgressRing';
import StatusCards from './StatusCards';
import CheckOutConfirmDialog from './CheckOutConfirmDialog';

const STATUS_META = {
  [attendanceStatus.ACTIVE]: { label: 'Active', color: 'primary', heading: 'Working Time' },
  [attendanceStatus.PAUSED]: { label: 'Paused', color: 'primaryLight', heading: 'On a Break' },
  [attendanceStatus.COMPLETED]: { label: 'Completed', color: 'default', heading: 'Your day is complete' },
  idle: { label: 'Not Started', color: 'default', heading: 'Ready to start your day' },
};

const Timer = () => {
  const [openCheckOutDialog, setOpenCheckOutDialog] = useState(false);
  const currentAttendance = useSelector(state => state.Attendance.currentAttendance);
  const isLoading = useSelector(state => state.Attendance.isLoading);
  const selectedProjectId = useSelector(state => state.Projects.selectedProjectId);
  const status = currentAttendance?.status;

  const isPaused = status === attendanceStatus.PAUSED;
  const isTimerRunning = status === attendanceStatus.ACTIVE;
  const isCheckedOut = status === attendanceStatus.COMPLETED;
  const actionDisabled = isLoading || !selectedProjectId;
  const meta = STATUS_META[status] ?? STATUS_META.idle;

  return (
    <Paper sx={{ p: { xs: 2.5, md: 3.5 }, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1, color: 'text.secondary', lineHeight: 1 }}>
          {getFormattedDate(new Date())}
        </Typography>
        <StatusChip
          color={meta.color}
          label={meta.label}
          pulse={isTimerRunning}
          sx={{ height: 26, '& .MuiChip-label': { px: 1 } }}
          iconSx={{ fontSize: '10px !important', ml: '8px !important' }}
        />
      </Stack>

      <TimerProgressRing isPaused={isPaused} heading={meta.heading}>
        <ElapsedCounter status={status} />
      </TimerProgressRing>

      {isCheckedOut ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          <Typography sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
            Check-Out Time:
          </Typography>
          <Typography sx={{ fontWeight: 700, color: 'primaryLight.main' }}>
            {getFormattedDate(currentAttendance.checkOutTime, true)}
          </Typography>
        </Box>
      ) : null}
      {isCheckedOut ? null : <WorkDetail isTimerRunning={isTimerRunning} />}

      <Stack direction="row" spacing={1.5} sx={{ width: '100%' }}>
        {!currentAttendance && (
          <ActionButton
            color="primary"
            icon={LoginOutlinedIcon}
            onClick={checkIn}
            disabled={actionDisabled}
            tooltip={!isLoading && !selectedProjectId ? 'Please select a project you are going to work on' : ''}
          >
            Check In
          </ActionButton>
        )}

        {isTimerRunning || isPaused ? (
          <>
            {isPaused ? (
              <ActionButton
                color="primary"
                icon={PlayArrowIcon}
                onClick={resumeTimer}
                disabled={actionDisabled}
                tooltip={!isLoading && !selectedProjectId ? 'Please select a project you are working on' : ''}
              >
                Resume
              </ActionButton>
            ) : (
              <ActionButton color="primaryLight" icon={PauseIcon} onClick={pauseTimer} disabled={isLoading}>
                Pause
              </ActionButton>
            )}
            <ActionButton
              variant="outlined"
              color="primary"
              icon={LogoutOutlinedIcon}
              onClick={() => setOpenCheckOutDialog(true)}
              disabled={isLoading}
            >
              Check Out
            </ActionButton>
          </>
        ) : null}
      </Stack>

      <StatusCards currentAttendance={currentAttendance} />

      {openCheckOutDialog ? <CheckOutConfirmDialog onClose={() => setOpenCheckOutDialog(false)} /> : null}
    </Paper>
  );
};

export default Timer;

const ActionButton = ({ color, icon: Icon, onClick, disabled, children, variant = 'contained', tooltip = '' }) => {
  const button = (
    <Button
      variant={variant}
      color={color}
      size="large"
      startIcon={<Icon />}
      onClick={() => onClick()}
      disabled={disabled}
      fullWidth
      disableElevation
      sx={{ fontWeight: 600, py: 1.1 }}
    >
      {children}
    </Button>
  );

  if (!tooltip) return button;

  // A disabled MUI Button does not fire hover events, so the Tooltip needs a wrapping span.
  return (
    <Tooltip title={tooltip} arrow placement="top">
      <Box component="span" sx={{ width: '100%' }}>
        {button}
      </Box>
    </Tooltip>
  );
};
