import React, { useEffect, useState } from "react";
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView,
  Image, Linking
} from "react-native";
import serviciosServices from "../services/serviciosServices";

const ServiciosScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    try {
      const data = await serviciosServices.listar();
      setServicios(data);
    } catch (error) {
      console.log("Error listando servicios:", error);
    }
  };

  const handleLlamar = (telefono) => {
    Linking.openURL(`tel:${telefono}`);
  };

  return (
    <View style={styles.container}>
      
      {/* Buscador */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate("CrearServicio")}
        >
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        {servicios.map(servicio => (
          <View key={servicio.id} style={styles.card}>

            {/* IMAGEN */}
            {servicio.imagen && (
              <Image source={{ uri: servicio.imagen }} style={styles.bannerImage} />
            )}

            <View style={styles.cardFooter}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{servicio.nombre}</Text>
                <Text style={styles.cardDescription}>{servicio.descripcion}</Text>
              </View>

              <TouchableOpacity
                style={styles.phoneButton}
                onPress={() => handleLlamar(servicio.telefono)}
              >
                <Text style={styles.phoneText}>{servicio.telefono}</Text>
              </TouchableOpacity>
            </View>

          </View>
        ))}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#00B4D8',
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#E8E8E8',
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 15,
    color: '#333',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  addIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  banner: {
    backgroundColor: '#751E1E',
    overflow: 'hidden',
  },
  bannerContent: {
    padding: 20,
    paddingBottom: 0,
    position: 'relative',
    height: 200,
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 32,
    zIndex: 2,
  },
  badgeContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 3,
  },
  logoBadge: {
    backgroundColor: '#000000',
    borderRadius: 50,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  logoIcon: {
    fontSize: 24,
  },
  logoText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
  },
  bannerImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  features: {
    backgroundColor: '#03045E',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#FFFFFF',
    flex: 1,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  whatsappIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  whatsappText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E8E8E8',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
  },
  phoneButton: {
    backgroundColor: '#CAF0F8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  phoneText: {
    fontSize: 13,
    color: '#751E1E',
    fontWeight: '700',
  },
  purinaBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  purinaLogo: {
    width: '100%',
    height: 60,
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

export default ServiciosScreen;