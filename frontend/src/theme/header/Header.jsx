import HeaderContent from './HeaderContent';
import { AppBar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { HEADER_HEIGHT } from '@/utils/constants';

const Header = () => {
  return (
    <MuiAppBar>
      <HeaderContent />
    </MuiAppBar>
  );
};
export default Header;

const MuiAppBar = styled(AppBar)(() => ({
  height: HEADER_HEIGHT,
  position: 'fixed',
  top: 0,
  justifyContent: 'center',
  background: '#f4f9f3',
  boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
}));
