import axios from 'axios';
import { SUGGEST_API_KEY } from '@env';
import { resetUser } from '../../state/auth';

const CONTENT_TYPE = 'application/json';
const apiBaseUrl = 'http://89.111.131.191:1337/api/';

const UNAUTHTORIZED = 401;

export const API = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': CONTENT_TYPE,
  },
});

export const SuggestAPI = axios.create({
  baseURL: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/',
  headers: {
    'Content-Type': CONTENT_TYPE,
    Accept: CONTENT_TYPE,
    Authorization: `Token ${SUGGEST_API_KEY}`,
  },
});

API.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    console.log('error', error?.response?.status === UNAUTHTORIZED);
    if (error.response.status === UNAUTHTORIZED) {
      resetUser();
    }
    return error;
  }
);
