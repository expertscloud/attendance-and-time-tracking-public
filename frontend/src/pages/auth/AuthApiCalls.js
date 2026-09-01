import { dispatch } from '@/store/store';
import axios from 'axios';
import { setUserDetail } from '@/store/reducers/userSlice';
import { setSnackbarObj } from '@/store/reducers/alertsSlice';
import { handleCatchError, handleErrorMessages, handleLogout, setItemInLocalStorage } from '@/utils/helpers';
import { genderOptions } from '@/utils/constants';
import { config } from '@/config/config';

const formatAndSetUserDetail = user => {
  dispatch(
    setUserDetail({
      id: user.id,
      fullName: user.fullName || '',
      email: user.email || '',
      isActive: Boolean(user.isActive),
      designation: user.designation || null,
      employmentType: user.employmentType || null,
      workMode: user.workMode || null,
      employeeId: user.userDetail?.employeeId ?? null,
      phoneNumber: user.userDetail?.phoneNumber ?? '',
      emergencyContactNumber: user.userDetail?.emergencyContactNumber ?? '',
      dob: user.userDetail?.dob ?? null,
      joiningDate: user.userDetail?.joiningDate ?? null,
      gender: genderOptions.find(g => g.id === user.userDetail?.gender) ?? null,
      address: user.userDetail?.address ?? '',
      profileSignedUrl: user.profileSignedUrl ?? null,
    })
  );
};

export const handleSignIn = async userDetails => {
  setItemInLocalStorage('last_sign_in_email', userDetails.email);
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

export const handleChangePassword = async (previousPassword, newPassword) => {
  try {
    const response = await axios.patch('auth/user/change-password', { previousPassword, newPassword });
    if (response.status) {
      dispatch(setSnackbarObj({ message: response.message || 'Password changed successfully!', severity: 'success' }));
      return true;
    }
    handleErrorMessages(response.errors);
    return false;
  } catch (error) {
    handleCatchError(error);
    return false;
  }
};

export const checkIsUpdateAvailable = async () => {
  try {
    const response = await axios.get('api/app-version');
    if (response.status && response.data) {
      return response.data !== config.appVersion;
    }
    return false;
  } catch (error) {
    handleCatchError(error);
    return false;
  }
};
