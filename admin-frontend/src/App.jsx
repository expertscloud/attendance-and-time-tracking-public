import Routes from '@/routes/routes';
import CssBaseline from '@mui/material/CssBaseline';
import ProgressAlerts from '@/shared/progressAlerts/ProgressAlerts';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme/theme';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <ProgressAlerts />
      <CssBaseline />
      <Routes />
    </ThemeProvider>
  );
};

export default App;
