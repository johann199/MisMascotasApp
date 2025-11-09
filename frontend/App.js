import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { healthAPI } from './src/api/endpoints';
import { API_URL } from './src/config/api';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setConnectionStatus('checking');
    setError(null);

    console.log('Probando conexión con:', API_URL);

    const result = await healthAPI.check();

    if (result.success) {
      console.log('Conectado:', result.data);
      setConnectionStatus('connected');
    } else {
      console.error('Error:', result.error);
      setConnectionStatus('error');
      setError(result.error);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  if (connectionStatus === 'checking') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Conectando con el servidor...</Text>
        <Text style={styles.apiUrl}>{API_URL}</Text>
      </View>
    );
  }

  if (connectionStatus === 'error') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}> Error de conexión</Text>
        <Text style={styles.errorDetail}>{error}</Text>
        <Text style={styles.apiUrl}>Intentando conectar a:</Text>
        <Text style={styles.apiUrl}>{API_URL}</Text>
        <Button title="Reintentar" onPress={testConnection} />
        <Text style={styles.help}>
          {'\n'}Verifica que:{'\n'}
          1. Django esté corriendo en 0.0.0.0:8000{'\n'}
          2. Tu IP local sea correcta{'\n'}
          3. Estés en la misma red WiFi
        </Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <View style={styles.container}>
        <LoginScreen />
        {/* home */}
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  successText: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 20,
    color: '#f44336',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  apiUrl: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
    marginTop: 5,
  },
  help: {
    marginTop: 20,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});