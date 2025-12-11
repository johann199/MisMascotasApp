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
      console.log('Usuario completo:', storedUser);
      console.log('Teléfono específico:', storedUser?.telefono); 
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

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>

        {/* AVATAR */}
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: user?.imagen_perfil || '../../assets/img/splash.png',
            }}
            style={styles.avatar}
          />
        </View>
      </View>
    
      <Text style={styles.greeting}>
        ¡Hola, {user?.username || 'usuario'}!
      </Text>

      {/* CONTENEDOR DE DATOS */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={20} color="#5B8A9E" style={styles.icon} />
          <Text style={styles.infoText}>{user?.username || 'Nombre de usuario'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color="#5B8A9E" style={styles.icon} />
          <Text style={styles.infoText}>{user?.email || 'Correo'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={20} color="#5B8A9E" style={styles.icon} />
          <Text style={styles.infoText}>{user?.telefono || 'Celular'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: { alignItems: 'center', paddingTop: 40 },

  patternBackground: {
    width: '100%',
    height: 160,
    backgroundColor: '#00B4D8',
    position: 'absolute',
    top: 0,
  },

  logoutBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
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

  infoContainer: {
    backgroundColor: '#E8EDEF',
    marginHorizontal: 30,
    marginTop: 30,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },

  icon: {
    marginRight: 15,
  },

  infoText: {
    fontSize: 16,
    color: '#4A6B7C',
    flex: 1,
  },
});

export default PerfilScreen;