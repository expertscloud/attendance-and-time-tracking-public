import { createTheme } from '@mui/material/styles';
// import { green, purple } from '@mui/material/colors';

// import { GRADIENT_COLOR } from 'utils/constants';

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '6px',
          // '&.Mui-disabled': {
          //   background: 'rgba(0, 0, 0, 0.12)'
          // }
        },
        // contained: {
        //   background: GRADIENT_COLOR
        // },
        outlined: {
          background: 'transparent', // Ensures outlined buttons do not get the gradient
          // borderColor: GRADIENT_COLOR // Apply the gradient color to the border if needed
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevent capitalization
        },
      },
    },
    // MuiTypography: {
    //   styleOverrides: {
    //     root: {
    //       background: GRADIENT_COLOR,
    //       WebkitBackgroundClip: 'text',
    //       WebkitTextFillColor: 'transparent',
    //       // Optional: Add these lines if you want it to work in Firefox as well
    //       MozBackgroundClip: 'text',
    //       MozTextFillColor: 'transparent'
    //     }
    //   }
    // }
  },
  palette: {
    primary: { main: '#063465' },
    primaryLight: { main: '#8AC2FA' },
  },
});

export default theme;
