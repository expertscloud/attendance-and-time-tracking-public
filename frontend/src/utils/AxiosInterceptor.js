import axios from 'axios';
import { config } from '@/config/config';
import { getLocalStorageItem, handleLogout } from './helpers';

const AxiosInterceptor = {
  initialized: false,

  initialize: () => {
    if (AxiosInterceptor.initialized) return;
    AxiosInterceptor.initialized = true;

    axios.defaults.baseURL = config.backendUrl;
    axios.defaults.timeout = 10000;

    if (config.backendUrl && config.backendUrl.includes('ngrok')) {
      axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';
    }

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
      error => Promise.reject(error)
    );

    axios.interceptors.response.use(
      response => response.data,
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
