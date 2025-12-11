import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MascotasService from "../services/mascotasServices";

export default function MatchScreen({ route, navigation }) {
  const { mascotaId, mascotaNombre } = route.params;
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatch();
  }, [mascotaId]);

  const fetchMatch = async () => {
    console.log("Buscando matches para mascota ID:", mascotaId);
    setLoading(true);

    const result = await MascotasService.buscarMatch(mascotaId);
    
    console.log("Resultado completo:", result);
    console.log("Success:", result.success);
    console.log("Data:", result.data);

    if (result.success) {
      console.log("Matches array:", result.data.matches);
      console.log("Total matches:", result.data.matches?.length || 0);
      setMatchData(result.data);
    } else {
      console.error("Error:", result.error);
      Alert.alert("Error", result.error);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7B6BA8" />
        <Text style={styles.loadingText}>Buscando coincidencias...</Text>
        <Text style={styles.loadingSubtext}>Analizando imágenes con IA</Text>
      </View>
    );
  }

  // ✅ Verificar correctamente la estructura de datos
  const matches = matchData?.matches || [];
  const mascotaBase = matchData?.mascota_base;

  console.log("Matches a renderizar:", matches.length);

  if (matches.length === 0) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Coincidencias</Text>
        </View>

        {/* Empty State */}
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={80} color="#CCC" />
          <Text style={styles.emptyTitle}>
            No se encontraron coincidencias
          </Text>
          <Text style={styles.emptyText}>
            No hay mascotas que coincidan con {mascotaNombre || "esta mascota"}.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMatch}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Renderizar cada match
  const renderMatch = ({ item, index }) => {
    console.log("Renderizando match:", item);
    
    return (
      <TouchableOpacity
        style={styles.matchCard}
        onPress={() => {
          Alert.alert(
            item.nombre,
            `Similitud: ${(item.similitud * 100).toFixed(1)}%\n\nRaza: ${item.raza}\n\n${item.descripcion || "Sin descripción"}`
          );
        }}
      >
        <Image
          source={{ uri: MascotasService.getImageUrl(item.imagen) }}
          style={styles.matchImage}
          resizeMode="cover"
        />

        <View style={styles.matchInfo}>
          <View style={styles.matchHeader}>
            <Text style={styles.matchName}>{item.nombre}</Text>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>#{index + 1}</Text>
            </View>
          </View>

          <Text style={styles.matchRaza}>{item.raza}</Text>

          {item.descripcion && (
            <Text style={styles.matchDescription} numberOfLines={2}>
              {item.descripcion}
            </Text>
          )}

          <View style={styles.matchFooter}>
            <View
              style={[
                styles.tipoBadge,
                item.tipo_reporte === "Pérdida"
                  ? styles.perdidaBadge
                  : styles.encontradaBadge,
              ]}
            >
              <Text
                style={[
                  styles.tipoText,
                  item.tipo_reporte === "Pérdida"
                    ? styles.perdidaText
                    : styles.encontradaText,
                ]}
              >
                {item.tipo_reporte}
              </Text>
            </View>

            <View style={styles.similarityContainer}>
              <Ionicons name="star" size={16} color="#FFB300" />
              <Text style={styles.similarityText}>
                {(item.similitud * 100).toFixed(0)}% similar
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Coincidencias</Text>
          {mascotaBase && (
            <Text style={styles.headerSubtitle}>
              {mascotaBase.nombre} • {mascotaBase.tipo_reporte}
            </Text>
          )}
        </View>
      </View>

      {/* Resultado */}
      <View style={styles.resultHeader}>
        <Text style={styles.resultCount}>
          {matches.length}{" "}
          {matches.length === 1 ? "coincidencia" : "coincidencias"}
        </Text>
        <Text style={styles.resultSubtext}>Ordenadas por similitud</Text>
      </View>

      {/* Lista de matches */}
      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#999",
  },
  resultHeader: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  resultCount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  resultSubtext: {
    fontSize: 13,
    color: "#999",
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  matchCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchImage: {
    width: 120,
    height: 140,
    backgroundColor: "#E0E0E0",
  },
  matchInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  matchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  matchName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  rankBadge: {
    backgroundColor: "#7B6BA8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  rankText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  matchRaza: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  matchDescription: {
    fontSize: 13,
    color: "#999",
    marginBottom: 8,
    lineHeight: 18,
  },
  matchFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  },
  tipoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  perdidaBadge: {
    backgroundColor: "#FFEBEE",
  },
  encontradaBadge: {
    backgroundColor: "#E8F5E9",
  },
  tipoText: {
    fontSize: 12,
    fontWeight: "600",
  },
  perdidaText: {
    color: "#C62828",
  },
  encontradaText: {
    color: "#2E7D32",
  },
  similarityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  similarityText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFB300",
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginTop: 16,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: "#7B6BA8",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});