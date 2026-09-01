import { Avatar, Box, Chip, Divider, Grid, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import ContactEmergencyRoundedIcon from '@mui/icons-material/ContactEmergencyRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import LaptopMacRoundedIcon from '@mui/icons-material/LaptopMacRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import { PersonRounded } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import UserImg from '@/assets/user.jpg';

const HeaderDetailLine = ({ icon, label, value }) => (
  <Stack direction="row" spacing={1} sx={{ width: '100%', alignItems: 'flex-start' }}>
    <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', flexShrink: 0, minWidth: 130 }}>
      {icon ? <Box sx={{ display: 'flex' }}>{icon}</Box> : null}
      <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
        {label}:
      </Typography>
    </Stack>
    <Typography variant="body2" sx={{ flex: 1, minWidth: 0, wordBreak: 'break-word' }}>
      {value || '—'}
    </Typography>
  </Stack>
);

const InfoRow = ({ icon, label, value }) => (
  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1.5,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'primary.main',
          bgcolor: theme => alpha(theme.palette.primary.main, 0.08),
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.25 }} noWrap>
          {value || '—'}
        </Typography>
      </Box>
    </Stack>
  </Grid>
);

const UserDetailsInfo = () => {
  const userDetail = useSelector(state => state.User.userDetail);
  if (!userDetail) return null;

  return (
    <Box sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 1, bgcolor: 'background.paper' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '170px 1fr' },
          gridTemplateRows: { xs: 'auto auto auto', md: 'auto auto' },
        }}
      >
        <Box
          sx={{
            gridColumn: '1 / -1',
            gridRow: { xs: '1 / 3', md: 1 },
            position: 'relative',
            bgcolor: 'primary.main',
            backgroundImage: 'url(/src/assets/user-details-card-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'common.white',
          }}
        >
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: '#0B17268C' }} />
        </Box>

        <Box
          sx={{
            gridColumn: { xs: 1, md: 1 },
            gridRow: { xs: 1, md: '1 / 3' },
            zIndex: 2,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            mt: { xs: 2, md: 4.5 },
            ml: { xs: 2, md: 4 },
          }}
        >
          <Avatar
            variant="rounded"
            src={userDetail?.profileSignedUrl || UserImg}
            sx={{
              width: 140,
              height: 140,
              borderRadius: 2,
              color: 'common.white',
              fontWeight: 600,
              fontSize: 28,
              bgcolor: theme => alpha(theme.palette.common.white, 0.15),
              border: theme => `2px solid ${alpha(theme.palette.common.white, 0.4)}`,
              boxShadow: 3,
            }}
          />
        </Box>

        <Box
          sx={{
            gridColumn: { xs: 1, md: 2 },
            gridRow: { xs: 2, md: 1 },
            position: 'relative',
            zIndex: 1,
            p: { xs: 2, md: 4 },
            color: 'common.white',
          }}
        >
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={{ xs: 2, lg: 4 }}
            sx={{ alignItems: { lg: 'flex-start' }, justifyContent: 'space-between' }}
          >
            <Stack spacing={0.75}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {userDetail.fullName}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {userDetail.email}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  size="small"
                  label={userDetail.isActive ? 'Active' : 'Inactive'}
                  sx={{
                    bgcolor: 'common.white',
                    color: 'primary.main',
                    fontWeight: 600,
                  }}
                />
                {userDetail.designation?.label ? (
                  <Chip
                    size="small"
                    label={userDetail.designation.label}
                    sx={{ bgcolor: 'common.white', color: 'primary.main', fontWeight: 600 }}
                  />
                ) : null}
              </Stack>
            </Stack>

            <Stack
              direction="row"
              spacing={0}
              divider={<Divider orientation="vertical" flexItem sx={{ borderColor: alpha('#fff', 0.35), mx: 2.5 }} />}
              sx={{ flex: 1, maxWidth: { lg: 600 }, width: '100%', alignItems: 'center' }}
            >
              <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                <HeaderDetailLine icon={<EventAvailableRoundedIcon fontSize="small" />} label="Date of Birth" value={userDetail.dob} />
                <HeaderDetailLine icon={<PersonRounded fontSize="small" />} label="Gender" value={userDetail.gender?.label} />
                <HeaderDetailLine icon={<PhoneRoundedIcon fontSize="small" />} label="Contact" value={userDetail.phoneNumber} />
              </Stack>
              <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                <HeaderDetailLine
                  icon={<ContactEmergencyRoundedIcon fontSize="small" />}
                  label="Emergency Contact"
                  value={userDetail.emergencyContactNumber}
                />
                <HeaderDetailLine icon={<LocationOnRoundedIcon fontSize="small" />} label="Address" value={userDetail.address} />
              </Stack>
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ gridColumn: { xs: 1, md: 2 }, gridRow: { xs: 3, md: 2 }, p: { xs: 2.5, md: 3 }, pl: { xs: 2.5, md: 2 } }}>
          <Grid container spacing={2}>
            <InfoRow icon={<BadgeRoundedIcon />} label="Designation" value={userDetail.designation?.label} />
            <InfoRow icon={<WorkRoundedIcon />} label="Employment Type" value={userDetail.employmentType?.label} />
            <InfoRow icon={<LaptopMacRoundedIcon />} label="Work Mode" value={userDetail.workMode?.label} />
            <InfoRow icon={<EventAvailableRoundedIcon />} label="Joined" value={userDetail.joiningDate} />
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default UserDetailsInfo;
