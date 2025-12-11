import React, { useState } from "react";
import { 
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import serviciosServices from "../services/serviciosServices";

export default function CreateServiceScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [imagen, setImagen] = useState(null);

  // Seleccionar imagen
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  // Guardar servicio
  const handleSubmit = async () => {
    if (!nombre || !descripcion || !telefono) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    const data = { nombre, descripcion, telefono };

    const response = await serviciosServices.crear(data, imagen);

    if (response) {
      Alert.alert("Éxito", "Servicio creado correctamente");
      navigation.goBack();
    } else {
      Alert.alert("Error", "No se pudo crear el servicio");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Crear Servicio</Text>

      {/* Campo Nombre */}
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del servicio"
        placeholderTextColor="#888"
        value={nombre}
        onChangeText={setNombre}
      />

      {/* Campo Descripción */}
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descripción del servicio"
        placeholderTextColor="#888"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      {/* Campo Teléfono */}
      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        placeholder="Numero telefónico"
        placeholderTextColor="#888"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />

      {/* Imagen */}
      <Text style={styles.label}>Imagen de Publicidad</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {imagen ? (
          <Image source={{ uri: imagen }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePickerText}>Seleccionar imagen</Text>
        )}
      </TouchableOpacity>

      {/* Botón guardar */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>Guardar Servicio</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 15,
    color: "#444",
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  imagePicker: {
    height: 180,
    backgroundColor: "#E8E8E8",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    overflow: "hidden",
  },
  imagePickerText: {
    color: "#666",
    fontSize: 14,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  saveButton: {
    backgroundColor: "#03045E",
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
