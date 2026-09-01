import { Avatar, Box, Paper, Stack, Typography, alpha } from '@mui/material';
import { getInitials, getFormattedDate } from '@/utils/helpers';
import { memberStatusMap } from '@/utils/constants';
import StatusChip from '@/shared/StatusChip';

const MemberCard = ({ member }) => {
  const status = member.status?.toLowerCase() || '';
  const { colorKey, label: statusLabel, isActive = false } = memberStatusMap[status] || memberStatusMap.default;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderColor: isActive ? 'divider' : `${colorKey}.main`,
        borderWidth: isActive ? 1 : 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1, minWidth: 0 }}>
        <Avatar
          src={member.profileUrl}
          alt={member.userName}
          sx={{
            width: 52,
            height: 52,
            bgcolor: theme => alpha(theme.palette[colorKey].main, 0.1),
            color: `${colorKey}.main`,
            fontWeight: 700,
          }}
        >
          {getInitials(member.userName)}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {member.userName}
          </Typography>

          <Typography variant="caption">{member.designation || 'Team Member'}</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pt: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <StatusChip
          color={colorKey}
          label={statusLabel}
          pulse={isActive}
          sx={{ fontWeight: 700, height: 18, fontSize: '0.6rem', '& .MuiChip-label': { px: 0.75 } }}
          iconSx={{ fontSize: '6px !important', ml: '4px !important' }}
        />

        <Stack direction="row" spacing={0.5} sx={{ minWidth: 0, overflow: 'hidden', alignItems: 'center' }}>
          {member.checkInTime && (
            <Stack direction="row" spacing={0.4} sx={{ minWidth: 0, alignItems: 'center' }}>
              <Typography variant="caption">
                {getFormattedDate(member.checkInTime, true, true)} &rarr;{' '}
                {member.checkOutTime ? getFormattedDate(member.checkOutTime, true, true) : 'Working'}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Box>
    </Paper>
  );
};

export default MemberCard;
