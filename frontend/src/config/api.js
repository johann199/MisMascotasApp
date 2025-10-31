import Constants from 'expo-constants';

const getLocalIP = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    
    return debuggerHost.split(':')[0];
  }
  return '127.0.0.1';
};

const getApiUrl = () => {
  if (__DEV__) {
    const localIP = getLocalIP();
    console.log(' Conectando a API en:', `http://${localIP}:8000/api`);
    return `http://${localIP}:8000/api`;
  }
  
  return 'https://mismascotasApp.com/api'; // no existe, este es solo un ejemplo
};

export const API_URL = getApiUrl();
export const API_TIMEOUT = 10000;