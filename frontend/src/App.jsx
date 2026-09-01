import { BrowserRouter, HashRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme/theme';
import Routes from '@/routes/routes';
import ProgressAlerts from '@/shared/progressAlerts/ProgressAlerts';

const App = () => {
  const Router = window.location.protocol === 'file:' ? HashRouter : BrowserRouter;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProgressAlerts />
      <Router>
        <Routes />
      </Router>
    </ThemeProvider>
  );
};

export default App;
