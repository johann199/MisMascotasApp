import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput,
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import mascotasServices from '../services/mascotasServices';

const ReportarMascotaPerdidaScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    dia: '',
    raza: '',
  });
  
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [fecha, setFecha] = useState(new Date());

  // Actualizar campos individuales
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Seleccionar imagen de la galería
  const handleSeleccionarImagen = async () => {
    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso requerido',
          'Se necesita acceso a la galería para seleccionar una imagen'
        );
        return;
      }

      // Abrir selector de imágenes
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImagen(result.assets[0].uri);
        console.log('Imagen seleccionada:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  // Tomar foto con la cámara
  const handleTomarFoto = async () => {
    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso requerido',
          'Se necesita acceso a la cámara para tomar una foto'
        );
        return;
      }

      // Abrir cámara
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImagen(result.assets[0].uri);
        console.log('Foto tomada:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  // Mostrar opciones de imagen
  const handleOpcionesImagen = () => {
    Alert.alert(
      'Seleccionar imagen',
      'Elige una opción',
      [
        {
          text: 'Tomar foto',
          onPress: handleTomarFoto,
        },
        {
          text: 'Elegir de galería',
          onPress: handleSeleccionarImagen,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  // Validar formulario
  const validarFormulario = () => {
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre de la mascota es requerido');
      return false;
    }
    if (!formData.raza.trim()) {
      Alert.alert('Error', 'La raza es requerida');
      return false;
    }
    if (!formData.descripcion.trim()) {
      Alert.alert('Error', 'La descripción es requerida');
      return false;
    }
    if (!formData.dia) {
      Alert.alert('Error', 'La fecha es requerida (formato: YYYY-MM-DD)');
      return false;
    }
    return true;
  };

  // Subir reporte
  const handleSubirReporte = async () => {
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      const mascotaData = {
        nombre: formData.nombre.trim(),
        raza: formData.raza.trim(),
        descripcion: formData.descripcion.trim(),
        dia: formData.dia,
        tipo_reporte: 'Pérdida',
      };

      const result = await mascotasServices.crearMascota(mascotaData, imagen);

      setLoading(false);

      if (result.success) {
        Alert.alert(
          '¡Éxito!',
          'Reporte de mascota perdida creado correctamente',
          [
            {
              text: 'Ver lista',
              onPress: () => navigation.navigate('Inicio'),
            },
          ]
        );
        setFormData({
          nombre: '',
          descripcion: '',
          dia: '',
          raza: '',
        });
        setImagen(null);
      } else {
        Alert.alert('Error', result.error || 'No se pudo crear el reporte');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error al subir reporte:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#0a0a0aff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reportar Mascota Perdida</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Área de subir foto */}
        <TouchableOpacity 
          style={styles.uploadArea}
          onPress={handleOpcionesImagen}
          activeOpacity={0.7}
        >
          {imagen ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imagen }} style={styles.uploadedImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImagen(null)}
              >
                <Ionicons name="close-circle" size={30} color="#E74C3C" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Ionicons name="camera" size={48} color="#5B9AAA" />
              <Text style={styles.uploadText}>Sube una foto de la mascota</Text>
              <Text style={styles.uploadSubtext}>Toca para seleccionar</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Nombre de la mascota */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Firulais"
            placeholderTextColor="#999"
            value={formData.nombre}
            onChangeText={(value) => updateField('nombre', value)}
          />
        </View>

        {/* Raza */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Raza *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Labrador"
            placeholderTextColor="#999"
            value={formData.raza}
            onChangeText={(value) => updateField('raza', value)}
          />
        </View>

        {/* Fecha */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha de pérdida *</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker(true)}
          >
            <Text style={{ color: '#333' }}>
              {fecha.toISOString().split('T')[0]}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={fecha}
              mode="date"
              display="calendar"
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) {
                  setFecha(selectedDate);
                  setFormData({
                    ...formData,
                    dia: selectedDate.toISOString().split('T')[0],
                  });
                }
              }}
            />
          )}
          <Text style={styles.helperText}>Formato: Año-Mes-Día</Text>
        </View>

        {/* Descripción */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe características de tu mascota, dónde se perdió, etc."
            placeholderTextColor="#999"
            value={formData.descripcion}
            onChangeText={(value) => updateField('descripcion', value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Botón Subir reporte */}
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubirReporte}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitText}>Subir reporte</Text>
          )}
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
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
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
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    color: '#5B9AAA',
    fontWeight: '600',
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
  },
  uploadedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 120,
    paddingTop: 14,
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    marginLeft: 4,
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
  submitButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default ReportarMascotaPerdidaScreen;