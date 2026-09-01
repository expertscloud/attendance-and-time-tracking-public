import { dispatch } from '@/store/store';
import { setSnackbarObj } from '@/store/reducers/alertsSlice';
import axios from 'axios';
import { setUserDetail } from '@/store/reducers/userSlice';
import { setLeaveTypesAndEnum } from '@/pages/leaveTypes/LeaveTypeApiCalls';
import { handleCatchError, handleErrorMessages, handleLogout, setItemInLocalStorage } from '@/utils/helpers';

export const resetPassword = async (email, otp, password) => {
  try {
    const response = await axios.post('auth/reset-password', { email, otp, password });
    if (response.status) {
      dispatch(setSnackbarObj({ message: 'Password reset successful. Please login with your new password.', severity: 'success' }));
      return true;
    }
    handleErrorMessages(response.errors);
  } catch (error) {
    handleCatchError(error);
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await axios.patch('auth/user/change-password', { previousPassword: oldPassword, newPassword });
    if (response.status) {
      dispatch(setSnackbarObj({ message: 'Password updated successfully.', severity: 'success' }));
      return true;
    }
    handleErrorMessages(response.errors);
  } catch (error) {
    handleCatchError(error);
  }
};

export const forgotPassword = async email => {
  try {
    const response = await axios.post('auth/forgot-password', { email });
    if (response.status) {
      dispatch(setSnackbarObj({ message: 'Password reset email sent. Please check your email.', severity: 'success' }));
      return true;
    }
    handleErrorMessages(response.errors);
  } catch (error) {
    handleCatchError(error);
  }
};

export const verifyForgotPassword = async (email, otp) => {
  try {
    const response = await axios.post('auth/verify-forgot-password', { email, otp });
    if (response.status) {
      dispatch(setSnackbarObj({ message: 'OTP verified successfully.', severity: 'success' }));
      return true;
    }
    handleErrorMessages(response.errors);
  } catch (error) {
    handleCatchError(error);
  }
};

export const handleSignUp = async userDetails => {
  try {
    const response = await axios.post('auth/register', userDetails);

    if (response.status && response.data?.token?.token) {
      dispatch(setSnackbarObj({ message: 'Sign-up successful. Thank you for joining!', severity: 'success' }));
      setItemInLocalStorage('authentication_token', response.data.token.token);
      formatAndSetUserDetail(response.data);
      return true;
    }
    handleErrorMessages(response.errors);
  } catch (error) {
    handleCatchError(error);
  }
};

const formatAndSetUserDetail = data => {
  const user = data.user || data;
  dispatch(setUserDetail({ id: user.id, name: user.fullName, email: user.email, type: user.type }));

  setLeaveTypesAndEnum(data.leaveTypes);
};

export const handleSignIn = async userDetails => {
  try {
    const response = await axios.post('auth/login', { email: userDetails.email, password: userDetails.password });
    if (response.status && response.data?.token?.token) {
      setItemInLocalStorage('authentication_token', response.data.token.token);
      formatAndSetUserDetail(response.data);
      return true;
    }
    handleErrorMessages(response.errors);
  } catch (error) {
    handleCatchError(error);
  }
};

export const fetchUserByAuthToken = async () => {
  try {
    const response = await axios.get('auth/me');

    if (response.status && response.data) {
      formatAndSetUserDetail(response.data);
      return true;
    }
    handleLogout();
  } catch (error) {
    handleCatchError(error);
    handleLogout();
  }
};
