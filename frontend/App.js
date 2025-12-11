import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button } from 'react-native';
import { healthAPI } from './src/api/endpoints';
import { API_URL } from './src/config/api';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import Navegacion from './Navigation';
import AuthService from './src/services/authService';

const Stack = createNativeStackNavigator();

/* === AUTH STACK === */
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setConnectionStatus('checking');
    setError(null);

    const result = await healthAPI.check();

    if (result.success) {
      setConnectionStatus('connected');
    } else {
      setConnectionStatus('error');
      setError(result.error);
    }
  };

  const checkAuthStatus = async () => {
    const hasToken = await AuthService.isAuthenticated();
    setIsAuthenticated(hasToken);
    setIsCheckingAuth(false);
  };

  useEffect(() => {
    const unsubscribe = AuthService.subscribeAuth((authState) => {
      setIsAuthenticated(authState);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const initialize = async () => {
      await testConnection();
      await checkAuthStatus();
    };
    initialize();
  }, []);


  if (connectionStatus === 'checking') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#03045E" />
        <Text style={styles.text}>Conectando con el servidor...</Text>
      </View>
    );
  }

  if (connectionStatus === 'error') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error de conexión</Text>
        <Text style={styles.errorDetail}>{error}</Text>
        <Button title="Reintentar" onPress={testConnection} />
      </View>
    );
  }

  if (isCheckingAuth) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#03045E" />
        <Text style={styles.text}>Verificando sesión...</Text>
      </View>
    );
  }


  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Navegacion onLogout={() => AuthService.logout()} />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    marginTop: 15,
    fontSize: 16
  },
  errorText: {
    fontSize: 20,
    color: 'red',
    marginBottom: 10
  },
  errorDetail: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20
  }
});
