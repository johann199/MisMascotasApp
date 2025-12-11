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

const ReportarMascotaEncontradaScreen = ({ navigation }) => {
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

  // Seleccionar imagen
  const handleSeleccionarImagen = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Debes permitir acceso a la galería.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImagen(result.assets[0].uri);
        console.log("Imagen seleccionada:", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  // Tomar foto
  const handleTomarFoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Debes permitir acceso a la cámara.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImagen(result.assets[0].uri);
        console.log("Foto tomada:", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error al tomar foto:", error);
    }
  };

  // Opciones de imagen
  const handleOpcionesImagen = () => {
    Alert.alert(
      'Seleccionar imagen',
      'Elige una opción',
      [
        { text: 'Tomar foto', onPress: handleTomarFoto },
        { text: 'Elegir de galería', onPress: handleSeleccionarImagen },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  // Validación
  const validarFormulario = () => {
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return false;
    }
    if (!formData.raza.trim()) {
      Alert.alert('Error', 'La raza es obligatoria');
      return false;
    }
    if (!formData.descripcion.trim()) {
      Alert.alert('Error', 'La descripción es obligatoria');
      return false;
    }
    if (!formData.dia.trim()) {
      Alert.alert('Error', 'La fecha es obligatoria (YYYY-MM-DD)');
      return false;
    }
    return true;
  };

  // Subir reporte encontrada
  const handleSubirReporte = async () => {
    if (!validarFormulario()) return;
    setLoading(true);

    try {
      const datos = {
        nombre: formData.nombre,
        raza: formData.raza,
        descripcion: formData.descripcion,
        dia: formData.dia,
        tipo_reporte: "Encontrada",
      };

      const result = await mascotasServices.crearMascota(datos, imagen);
      setLoading(false);

      if (result.success) {
        Alert.alert("¡Éxito!", "Reporte de mascota encontrada enviado.", [
          { text: "Volver", onPress: () => navigation.navigate("Inicio") },
        ]);
        navigation.navigate("MatchScreen", { mascotaId: result.data.id });

        setFormData({ nombre: "", descripcion: "", dia: "", raza: "" });
        setImagen(null);
      } else {
        Alert.alert("Error", result.error || "No se pudo enviar el reporte.");
      }
    } catch (err) {
      setLoading(false);
      console.error("Error al subir reporte encontrada:", err);
      Alert.alert("Error", "Ocurrió un error inesperado.");
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#0a0a0aff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reportar Mascota Encontrada</Text>
      </View>

      {/* CONTENIDO */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* IMAGEN */}
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

        {/* CAMPOS */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Perrito"
            placeholderTextColor="#999"
            value={formData.nombre}
            onChangeText={(v) => updateField("nombre", v)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Raza *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Mestizo"
            placeholderTextColor="#999"
            value={formData.raza}
            onChangeText={(v) => updateField("raza", v)}
          />
        </View>

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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder="Describe cómo y dónde la encontraste"
            placeholderTextColor="#999"
            value={formData.descripcion}
            onChangeText={(v) => updateField("descripcion", v)}
            textAlignVertical="top"
          />
        </View>

        {/* BOTÓN */}
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubirReporte}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFF" /> :
          <Text style={styles.submitText}>Subir reporte</Text>}
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
    height: 200,
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
    backgroundColor: '#03045E',
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