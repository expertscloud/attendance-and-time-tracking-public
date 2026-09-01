import axios from 'axios';
import { config } from '@/config/config';
import { getLocalStorageItem, handleLogout } from './helpers';

const AxiosInterceptor = {
  initialize: () => {
    axios.defaults.baseURL = config.backendUrl;
    axios.interceptors.request.use(
      axiosConfig => {
        const authToken = getLocalStorageItem('authentication_token');
        if (authToken && !axiosConfig.ignoreToken) {
          axiosConfig.headers['Authorization'] = `Bearer ${authToken}`;
        }
        if (!axiosConfig.rawHeader) {
          axiosConfig.headers['Content-Type'] = 'application/json';
        }
        return axiosConfig;
      },
      error => {
        Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      response => {
        return response.data;
      },
      error => {
        if (error.response?.status === 401) {
          handleLogout();
        }
        return Promise.reject(error);
      }
    );
  },
};

export default AxiosInterceptor;
