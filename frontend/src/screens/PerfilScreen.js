import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthService from '../services/authService';

const PerfilScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  // Cargar usuario al entrar a la pantalla
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AuthService.getUser();
      setUser(storedUser);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    // App.js detectará el cambio gracias a subscribeAuth()
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.patternBackground} />

        {/* AVATAR */}
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: user?.imagen_perfil || 'https://via.placeholder.com/120',
            }}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* NOMBRE */}
      <Text style={styles.greeting}>
        ¡Hola, {user?.username || 'usuario'}!
      </Text>

      {/* EMAIL */}
      {user?.email && (
        <Text style={styles.emailText}>{user.email}</Text>
      )}

      {/* CONTENIDO */}
      <View style={styles.content} />

      {/* BOTÓN LOGOUT */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: { alignItems: 'center', paddingTop: 40 },

  patternBackground: {
    width: '100%',
    height: 180,
    backgroundColor: '#7DD3C0',
    position: 'absolute',
    top: 0,
  },

  avatarContainer: {
    marginTop: 100,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    elevation: 5,
  },

  avatar: { width: 120, height: 120 },

  greeting: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    color: '#333',
  },

  emailText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginTop: 4,
  },

  content: { flex: 1 },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A9B8E',
    marginHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 40,
  },

  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PerfilScreen;
