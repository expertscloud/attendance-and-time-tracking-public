import { Avatar, Box, Chip, Divider, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import ContactEmergencyRoundedIcon from '@mui/icons-material/ContactEmergencyRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import LaptopMacRoundedIcon from '@mui/icons-material/LaptopMacRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/BackButton';
import { PersonRounded } from '@mui/icons-material';
import UserImg from '@/assets/user.jpg';
import { fetchUserDetail } from './UsersApiCalls';
import { useQuery } from '@tanstack/react-query';

const HeaderDetailLine = ({ icon, label, value, isLoading }) => (
  <Stack direction="row" spacing={1} sx={{ width: '100%', alignItems: 'flex-start' }}>
    <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', flexShrink: 0, minWidth: 130 }}>
      {icon ? <Box sx={{ display: 'flex' }}>{icon}</Box> : null}
      <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
        {label}:
      </Typography>
    </Stack>
    <Typography variant="body2" sx={{ flex: 1, minWidth: 0, wordBreak: 'break-word' }}>
      {isLoading ? <Skeleton variant="text" sx={{ bgcolor: 'rgba(255,255,255,0.25)' }} /> : value || '—'}
    </Typography>
  </Stack>
);

const InfoRow = ({ icon, label, value, isLoading }) => (
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
          {isLoading ? <Skeleton variant="text" /> : value || '—'}
        </Typography>
      </Box>
    </Stack>
  </Grid>
);

const UserDetailsInfo = ({ parsedUserId }) => {
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user-detail-page', parsedUserId],
    queryFn: () => fetchUserDetail(parsedUserId),
  });

  if (!isLoading && !user) return null;

  return (
    <Box sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 1, bgcolor: 'background.paper', position: 'relative' }}>
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
          {/* <Box sx={{ position: 'absolute', inset: 0, bgcolor: '#260b208c' }} /> */}
        </Box>

        <Box sx={{ position: 'absolute', top: 5, left: 5 }}>
          <BackButton onBack={() => navigate(-1)} color="white" />
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
            src={user?.profileSignedUrl || UserImg}
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
                {isLoading ? <Skeleton width={220} /> : `${user.fullName} - ${user.employeeId}`}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {isLoading ? <Skeleton width={180} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} /> : user.email}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {isLoading ? (
                  <>
                    <Skeleton variant="rounded" width={64} height={24} sx={{ borderRadius: 12, bgcolor: 'rgba(255,255,255,0.2)' }} />
                    <Skeleton variant="rounded" width={90} height={24} sx={{ borderRadius: 12, bgcolor: 'rgba(255,255,255,0.2)' }} />
                  </>
                ) : (
                  <>
                    <Chip
                      size="small"
                      label={user.isActive ? 'Active' : 'Inactive'}
                      sx={{
                        bgcolor: 'common.white',
                        color: 'primary.main',
                        fontWeight: 600,
                      }}
                    />
                    {user.designation?.label ? (
                      <Chip
                        size="small"
                        label={user.designation.label}
                        sx={{ bgcolor: 'common.white', color: 'primary.main', fontWeight: 600 }}
                      />
                    ) : null}
                  </>
                )}
              </Stack>
            </Stack>

            <Stack
              direction="row"
              spacing={0}
              divider={<Divider orientation="vertical" flexItem sx={{ borderColor: alpha('#fff', 0.35), mx: 2.5 }} />}
              sx={{ flex: 1, maxWidth: { lg: 600 }, width: '100%', alignItems: 'center' }}
            >
              <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                <HeaderDetailLine
                  icon={<EventAvailableRoundedIcon fontSize="small" />}
                  label="Date of Birth"
                  value={isLoading ? <Skeleton width={100} /> : user.dob}
                  isLoading={isLoading}
                />
                <HeaderDetailLine
                  icon={<PersonRounded fontSize="small" />}
                  label="Gender"
                  value={isLoading ? <Skeleton width={100} /> : user.gender?.label}
                  isLoading={isLoading}
                />
                <HeaderDetailLine
                  icon={<PhoneRoundedIcon fontSize="small" />}
                  label="Contact"
                  value={isLoading ? <Skeleton width={100} /> : user.phoneNumber}
                  isLoading={isLoading}
                />
              </Stack>
              <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                <HeaderDetailLine
                  icon={<ContactEmergencyRoundedIcon fontSize="small" />}
                  label="Emergency Contact"
                  value={isLoading ? <Skeleton width={100} /> : user.emergencyContactNumber}
                  isLoading={isLoading}
                />
                <HeaderDetailLine
                  icon={<LocationOnRoundedIcon fontSize="small" />}
                  label="Address"
                  value={isLoading ? <Skeleton width={100} /> : user.address}
                  isLoading={isLoading}
                />
              </Stack>
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ gridColumn: { xs: 1, md: 2 }, gridRow: { xs: 3, md: 2 }, p: { xs: 2.5, md: 3 }, pl: { xs: 2.5, md: 2 } }}>
          <Grid container spacing={2}>
            <InfoRow icon={<BadgeRoundedIcon />} label="Designation" value={user?.designation?.label} isLoading={isLoading} />
            <InfoRow icon={<WorkRoundedIcon />} label="Employment Type" value={user?.employmentType?.label} isLoading={isLoading} />
            <InfoRow icon={<LaptopMacRoundedIcon />} label="Work Mode" value={user?.workMode?.label} isLoading={isLoading} />
            <InfoRow icon={<EventAvailableRoundedIcon />} label="Joined" value={user?.joiningDate} isLoading={isLoading} />
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default UserDetailsInfo;
