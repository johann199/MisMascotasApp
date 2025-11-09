import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay sesión al iniciar la app
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await authService.getToken();
      const savedUser = await authService.getUser();

      if (token && savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const result = await authService.login(email, password);

    if (result.success) {
      setUser(result.data.user);
      setIsAuthenticated(true);
    }

    return result;
  };

  const register = async (email, password, username, firstName, lastName) => {
    const result = await authService.register(
      email,
      password,
      username,
      firstName,
      lastName
    );

    if (result.success) {
      setUser(result.data.user);
      setIsAuthenticated(true);
    }

    return result;
  };

  const loginWithGoogle = async (idToken, profileImage) => {
    const result = await authService.loginWithGoogle(idToken, profileImage);

    if (result.success) {
      setUser(result.data.user);
      setIsAuthenticated(true);
    }

    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (data) => {
    const result = await authService.updateProfile(data);

    if (result.success) {
      setUser(result.data);
    }

    return result;
  };

  const refreshUser = async () => {
    const result = await authService.refreshUser();

    if (result.success) {
      setUser(result.data);
    }

    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};