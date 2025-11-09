import {NGROK_URL} from '@env';
import Constants from 'expo-constants';

const getLocalIP = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    return debuggerHost.split(':')[0];
  }
  return NGROK_URL;
};

const getApiUrl = () => {
  if (__DEV__) {
    console.log(' Conectando a API en (ngrok):', `${NGROK_URL}/api`);
    return `${NGROK_URL}/api`; 

  }

  return 'https://mismascotasApp.com/api'; // URL de producción
};

export const API_URL = getApiUrl();
export const API_TIMEOUT = 10000;