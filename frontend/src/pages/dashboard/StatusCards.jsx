import { Divider, Stack } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getFormattedDate } from '@/utils/helpers';
import StatBox from './StatBox';
import PauseTime from './PauseTime';

const StatusCards = ({ currentAttendance }) => {
  return currentAttendance ? (
    <>
      <Divider sx={{ mx: -1 }} />
      <Stack direction="row" sx={{ justifyContent: 'space-evenly' }}>
        <StatBox
          icon={AccessTimeIcon}
          label="Check-In Time"
          value={getFormattedDate(currentAttendance.checkInTime, true, true)}
          color="primary.main"
        />
        <PauseTime currentAttendance={currentAttendance} />
      </Stack>
    </>
  ) : null;
};

export default StatusCards;
