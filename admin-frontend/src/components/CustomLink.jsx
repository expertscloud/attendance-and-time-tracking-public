import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink, useTheme } from '@mui/material';

const CustomLink = ({ to, children, sx, ...props }) => {
  const theme = useTheme();

  return (
    <MuiLink
      component={RouterLink}
      to={to}
      sx={{
        fontSize: '15px',
        textDecoration: 'none',
        color: theme.palette.primary.main,
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiLink>
  );
};

export default CustomLink;
