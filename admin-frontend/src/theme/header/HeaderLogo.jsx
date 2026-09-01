import { useDispatch, useSelector } from 'react-redux';
import { setSidebarCompact } from '@/store/reducers/themeOptionsSlice';
import IconButton from '@mui/material/IconButton';
import { Stack } from '@mui/material';
import Logo from '@/assets/logo.png';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { HEADER_HEIGHT } from '@/utils/constants';

const HeaderLogo = () => {
  const dispatch = useDispatch();
  const sidebarCompact = useSelector(state => state.ThemeOptions.sidebarCompact);

  return (
    <Stack direction="row" spacing={3} sx={{ alignItems: 'center', pl: '10px', height: HEADER_HEIGHT }}>
      <img src={Logo} alt="Tickly logo" width={130} style={{ display: 'block', height: 'auto' }} />
      <IconButton onClick={() => dispatch(setSidebarCompact())} sx={{ color: 'black' }}>
        {sidebarCompact ? <MenuIcon /> : <MenuOpenIcon />}
      </IconButton>
    </Stack>
  );
};

export default HeaderLogo;
