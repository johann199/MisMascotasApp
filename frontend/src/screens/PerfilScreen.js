import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PerfilScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('Inicio');
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.patternBackground}>
          {/* Aquí iría el patrón de gatos - por ahora color sólido */}
        </View>
        
        {/* Avatar circular */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/120' }}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* Saludo */}
      <Text style={styles.greeting}>¡Hola, usuario!</Text>

      {/* Espaciador */}
      <View style={styles.content} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
  },
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  avatar: {
    width: 120,
    height: 120,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    color: '#333333',
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    // Item activo
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconContainerActive: {
    backgroundColor: '#E8F4F1',
  },
  icon: {
    fontSize: 24,
  },
  navLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#4A9B8E',
    fontWeight: '600',
  },
});

export default PerfilScreen;