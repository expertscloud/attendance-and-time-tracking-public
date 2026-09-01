import { Grid } from '@mui/material';
import AuthCard from '@/shared/AuthCard';
import Description from './Description';
import SignInForm from './SignInForm';

const SignIn = () => {
  return (
    <Grid container sx={{ minHeight: '100vh', px: 1 }}>
      <Grid size={{ xs: 12, md: 6 }} sx={{ my: 1 }}>
        <AuthCard>
          <Description />
        </AuthCard>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }} container sx={{ justifyContent: 'center', alignItems: 'center' }}>
        <SignInForm />
      </Grid>
    </Grid>
  );
};

export default SignIn;
