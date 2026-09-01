import { useState } from 'react';
import { Typography, useMediaQuery, Stack, useTheme, Menu, MenuItem, Divider } from '@mui/material';
import StyledAvatar from './StyledAvatar';
import { useSelector } from 'react-redux';
import { handleLogout } from '@/utils/helpers';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));
  const userDetail = useSelector(state => state.User.userDetail);
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'center', px: '10px', cursor: 'pointer', '&:hover': { backgroundColor: theme.palette.action.hover } }}
        onClick={event => setAnchorEl(event.currentTarget)}
      >
        <StyledAvatar />
        {downMd ? null : (
          <>
            <Stack>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {userDetail.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {userDetail.email}
              </Typography>
            </Stack>
          </>
        )}
        {anchorEl ? <ExpandLess sx={{ color: 'black' }} /> : <ExpandMore sx={{ color: 'black' }} />}
      </Stack>

      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { mt: 1, minWidth: 260 } } }}
      >
        <MenuItem disabled sx={{ opacity: '1 !important', cursor: 'default', '&.Mui-disabled': { opacity: 1 } }}>
          <Stack sx={{ alignItems: 'center' }}>
            <StyledAvatar />
            <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>
              {userDetail.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {userDetail.email}
            </Typography>
          </Stack>
        </MenuItem>
        <Divider />
        <MenuItem
          sx={{ px: 3, py: 2 }}
          onClick={() => {
            setAnchorEl(null);
            navigate('/change-password');
          }}
        >
          Reset Password
        </MenuItem>
        <MenuItem
          sx={{ px: 3, py: 2 }}
          onClick={() => {
            setAnchorEl(null);
            handleLogout();
          }}
        >
          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
