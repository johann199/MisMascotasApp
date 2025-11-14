import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput,
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
const ReportarMascotaEncontradaScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [raza, setRaza] = useState('');
  const [imagen, setImagen] = useState(null);

  const handleSeleccionarImagen = () => {
    // Aquí integrarías react-native-image-picker o expo-image-picker
    console.log('Seleccionar imagen');
    Alert.alert('Funcionalidad', 'Aquí se abrirá el selector de imágenes');
  };

  const handleSubirReporte = () => {
    if (!nombre || !descripcion || !fecha || !raza) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    
    console.log('Subir reporte:', { nombre, descripcion, fecha, raza, imagen });
    Alert.alert('Éxito', 'Reporte enviado correctamente');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#0a0a0aff"
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Área de subir foto */}
        <TouchableOpacity 
          style={styles.uploadArea}
          onPress={handleSeleccionarImagen}
          activeOpacity={0.7}
        >
          {imagen ? (
            <Image source={{ uri: imagen }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Text style={styles.uploadIcon}>⬆</Text>
              <Text style={styles.uploadText}>Sube una foto de la mascota</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Nombre de la mascota */}
        <TextInput
          style={styles.input}
          placeholder="Nombre de la mascota"
          placeholderTextColor="#999"
          value={nombre}
          onChangeText={setNombre}
        />

        {/* Descripción */}
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descripción"
          placeholderTextColor="#999"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Fecha */}
        <TextInput
          style={styles.input}
          placeholder="mm/dd/yy"
          placeholderTextColor="#999"
          value={fecha}
          onChangeText={setFecha}
          keyboardType="numeric"
        />

        {/* Raza */}
        <TextInput
          style={styles.input}
          placeholder="Raza"
          placeholderTextColor="#999"
          value={raza}
          onChangeText={setRaza}
        />

        {/* Botón Subir reporte */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubirReporte}
          activeOpacity={0.8}
        >
          <Text style={styles.submitText}>Subir reporte</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  uploadArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 48,
    color: '#5B9AAA',
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 15,
    color: '#5B9AAA',
    fontWeight: '500',
  },
  uploadedImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 15,
    color: '#333',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: '#7B6BA8',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
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
    // Estado activo
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 11,
    color: '#666',
  },
  navLabelActive: {
    color: '#6BB5A4',
    fontWeight: '600',
  },
});

export default ReportarMascotaEncontradaScreen;