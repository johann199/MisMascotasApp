import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import MascotasService from "../services/mascotasServices";

export default function MatchScreen({ route }) {
  const { mascotaId } = route.params;
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatch() {
      const result = await MascotasService.buscarMatch(mascotaId);
      if (result.success) {
        setMatch(result.data);
      }
      setLoading(false);
    }
    fetchMatch();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#6B5CE7" />;

  if (!match || !match.mascotas || match.mascotas.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noMatch}>No se encontraron coincidencias</Text>
      </View>
    );
  }

  const mascota = match.mascotas[0];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Posible coincidencia encontrada!</Text>

      <Image
        source={{ uri: mascota.imagen }}
        style={styles.image}
      />

      <Text style={styles.text}>Nombre: {mascota.nombre}</Text>
      <Text style={styles.text}>Raza: {mascota.raza}</Text>
      <Text style={styles.text}>Similitud: {match.similitud}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  image: { width: 250, height: 250, borderRadius: 10, marginBottom: 15 },
  text: { fontSize: 16, marginBottom: 5 },
  noMatch: { fontSize: 18, color: "gray" }
});
