import axios from 'axios';
import queryClient from '@/lib/queryClient';
import { setSnackbarObj } from '@/store/reducers/alertsSlice';
import { dispatch } from '@/store/store';
import { getFormattedDate, handleCatchError, handleErrorMessages } from '@/utils/helpers';

const refreshClients = () => queryClient.invalidateQueries({ queryKey: ['clients'] });

const getFormattedClient = client => ({
  id: client.id,
  name: client.name || '',
  email: client.email || '',
  phone: client.phone || '',
  website: client.website || '',
  addressLine1: client.addressLine1 || '',
  addressLine2: client.addressLine2 || '',
  city: client.city || '',
  state: client.state || '',
  country: client.country || '',
  postalCode: client.postalCode || '',
  fullAddress: client.fullAddress || '',
  awsAccountId: client.awsAccountId || '',
  createdAt: getFormattedDate(client.createdAt, true),
});

export const fetchClients = async ({ searchedText, pageSize, page } = {}) => {
  try {
    const payload = { page, pageSize };

    if (searchedText) {
      payload.filters = [
        { columnName: 'name', type: 'like', value: searchedText },
        { columnName: 'email', type: 'like', value: searchedText },
      ];
    }

    const response = await axios.post('api/clients/listing', payload);

    if (response.status && response.data.data) {
      return { clients: response.data.data.map(getFormattedClient), totalPages: response.data.total_page_count };
    }

    handleErrorMessages(response?.errors);
    return { clients: [], totalPages: 0 };
  } catch (error) {
    handleCatchError(error);
    throw error;
  }
};

export const createClient = async clientData => {
  try {
    const response = await axios.post('api/clients', clientData);

    if (response.status) {
      dispatch(setSnackbarObj({ message: 'Client created successfully.', severity: 'success' }));
      refreshClients();
      return true;
    }
    handleErrorMessages(response?.errors);
  } catch (error) {
    handleCatchError(error);
  }
};

export const updateClient = async (clientId, payload) => {
  try {
    const response = await axios.patch(`api/clients/${clientId}`, payload);

    if (response.status) {
      dispatch(setSnackbarObj({ message: 'Client updated successfully.', severity: 'success' }));
      refreshClients();
      return true;
    }
    handleErrorMessages(response?.errors);
  } catch (error) {
    handleCatchError(error);
  }
};

export const deleteClient = async clientId => {
  try {
    const response = await axios.delete(`api/clients/${clientId}`);

    if (response.status) {
      dispatch(setSnackbarObj({ message: 'Client deleted successfully.', severity: 'success' }));
      refreshClients();
      return true;
    }
    handleErrorMessages(response?.errors);
  } catch (error) {
    handleCatchError(error);
  }
};

export const fetchClientDetail = async clientId => {
  try {
    const response = await axios.get(`api/clients/${clientId}`);
    if (response.status && response.data) {
      return getFormattedClient(response.data);
    }
    handleErrorMessages(response?.errors);
  } catch (error) {
    handleCatchError(error);
  }
};
