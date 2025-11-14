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
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ServiciosScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Inicio');

  // Datos de ejemplo de servicios
  const servicios = [
    {
      id: 1,
      nombre: 'Milenzo PetShop',
      descripcion: 'Aquí descripción',
      telefono: '309 224 3194',
      whatsapp: '318 9404033',
      imagen: 'https://via.placeholder.com/300x200',
      caracteristicas: [
        { icono: '👑', texto: 'Exclusividad' },
        { icono: '⭐', texto: 'La mejor calidad' },
        { icono: '✖️', texto: 'Productos totalmente rigorizados en el bienestar de tus mascota' }
      ]
    },
    // Puedes agregar más servicios aquí
  ];

  const handleLlamar = (telefono) => {
    Linking.openURL(`tel:${telefono.replace(/\s/g, '')}`);
  };

  const handleWhatsApp = (numero) => {
    Linking.openURL(`whatsapp://send?phone=${numero.replace(/\s/g, '')}`);
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
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de servicios */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {servicios.map((servicio) => (
          <View key={servicio.id} style={styles.card}>
            {/* Banner con imagen */}
            <View style={styles.banner}>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>AMAMOS{'\n'}CUIDAR A TUS{'\n'}MASCOTAS</Text>
                
                <View style={styles.badgeContainer}>
                  <View style={styles.logoBadge}>
                    <Text style={styles.logoIcon}>🐕</Text>
                    <Text style={styles.logoText}>Milenzo{'\n'}PetShop</Text>
                  </View>
                </View>

                <Image 
                  source={{ uri: servicio.imagen }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
              </View>

              {/* Características */}
              <View style={styles.features}>
                {servicio.caracteristicas.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Text style={styles.featureIcon}>{feature.icono}</Text>
                    <Text style={styles.featureText}>{feature.texto}</Text>
                  </View>
                ))}

                {/* WhatsApp */}
                <TouchableOpacity 
                  style={styles.whatsappButton}
                  onPress={() => handleWhatsApp(servicio.whatsapp)}
                >
                  <Text style={styles.whatsappIcon}>💬</Text>
                  <Text style={styles.whatsappText}>{servicio.whatsapp}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer de la card */}
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

        {/* Banner Purina */}
        <View style={styles.purinaBanner}>
          <Image
            source={{ uri: 'https://via.placeholder.com/300x80' }}
            style={styles.purinaLogo}
            resizeMode="contain"
          />
        </View>
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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#B8D4D1',
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
    backgroundColor: '#6B2DBF',
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
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 150,
    height: 180,
    zIndex: 1,
  },
  features: {
    backgroundColor: '#6B2DBF',
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
    backgroundColor: '#B8A7D6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  phoneText: {
    fontSize: 13,
    color: '#5B2D91',
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