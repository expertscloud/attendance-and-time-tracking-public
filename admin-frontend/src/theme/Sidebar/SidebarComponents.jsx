import { styled, alpha } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

const StyledNavItemButton = styled(ButtonBase)(({ theme, active }) => ({
  height: 44,
  width: '100%',
  padding: '0 18px',
  borderRadius: 8,
  marginBottom: 4,
  justifyContent: 'flex-start',
  transition: 'all 0.15s ease',
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.06) : 'transparent',
  color: active ? theme.palette.primary.main : 'inherit',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const NavItemButton = ({ active, sx, children, ...props }) => {
  return (
    <StyledNavItemButton active={active} sx={{ ...sx }} {...props}>
      {children}
    </StyledNavItemButton>
  );
};

const StyledBulletIcon = styled(Box)(({ theme, active }) => ({
  width: 4,
  height: 4,
  marginLeft: '10px',
  marginRight: '8px',
  overflow: 'hidden',
  borderRadius: '50%',
  background: active ? theme.palette.primary.main : theme.palette.text.disabled,
  boxShadow: active ? `0px 0px 0px 3px ${theme.palette.primary[200]}` : 'none',
}));

export const BulletIcon = ({ active, sx, ...props }) => {
  return <StyledBulletIcon active={active} sx={{ ...sx }} {...props} />;
};

const StyledBadgeValue = styled(Box, { shouldForwardProp: prop => prop !== 'sidebarCompact' })(({ theme, compact, sidebarCompact }) => ({
  fontSize: '12px',
  fontWeight: 500,
  color: 'white',
  padding: '1px 6px',
  overflow: 'hidden',
  borderRadius: '300px',
  backgroundColor: theme.palette.primary.main,
  transition: 'all 0.15s ease',
  display: compact ? 'none' : 'unset',
  ...(sidebarCompact && {
    opacity: 0,
    width: 0,
  }),
}));

export const BadgeValue = ({ compact, sx, ...props }) => {
  const sidebarCompact = useSelector(state => state.ThemeOptions.sidebarCompact);
  return <StyledBadgeValue compact={compact} sidebarCompact={sidebarCompact} sx={{ ...sx }} {...props} />;
};

const StyledBox = styled(Box)(({ ellipsis }) => ({
  ...(ellipsis && {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }),
}));

export const Paragraph = props => {
  const { ellipsis, children, className, ...others } = props;
  return (
    <StyledBox
      fontSize={14}
      component="p"
      fontWeight={500}
      ellipsis={ellipsis ? 1 : 0}
      className={clsx({
        [className || '']: true,
      })}
      {...others}
    >
      {children}
    </StyledBox>
  );
};

export const Span = props => {
  const { ellipsis, children, className, ...others } = props;
  return (
    <StyledBox
      fontSize={14}
      component="span"
      ellipsis={ellipsis ? 1 : 0}
      className={clsx({
        [className || '']: true,
      })}
      {...others}
    >
      {children}
    </StyledBox>
  );
};
