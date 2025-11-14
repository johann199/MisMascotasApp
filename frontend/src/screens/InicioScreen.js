import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InicioScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Inicio');


  // Datos de ejemplo
  const mascotas = [
    {
      id: 1,
      nombre: 'Ela',
      descripcion: 'Aquí descripción',
      estado: 'Perdido',
      imagen: 'https://via.placeholder.com/300x200'
    },
    // Puedes agregar más mascotas aquí
  ];

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
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs de filtros */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'Todos' && styles.tabActive]}
          onPress={() => setSelectedTab('Todos')}
        >
          <Text style={[styles.tabText, selectedTab === 'Todos' && styles.tabTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'Encontrados' && styles.tabActive]}
          onPress={() => setSelectedTab('Encontrados')}
        >
          <Text style={[styles.tabText, selectedTab === 'Encontrados' && styles.tabTextActive]}>
            Encontrados
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'Raza' && styles.tabActive]}
          onPress={() => setSelectedTab('Raza')}
        >
          <Text style={[styles.tabText, selectedTab === 'Raza' && styles.tabTextActive]}>
            Raza
          </Text>
        </TouchableOpacity>
      </View>

      {/* Segunda fila de tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'Perdidos' && styles.tabActive]}
          onPress={() => setSelectedTab('Perdidos')}
        >
          <Text style={[styles.tabText, selectedTab === 'Perdidos' && styles.tabTextActive]}>
            Perdidos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de mascotas */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {mascotas.map((mascota) => (
          <View key={mascota.id} style={styles.card}>
            <Image 
              source={{ uri: mascota.imagen }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardFooter}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{mascota.nombre}</Text>
                <Text style={styles.cardDescription}>{mascota.descripcion}</Text>
              </View>
              <View style={styles.estadoBadge}>
                <Text style={styles.estadoText}>{mascota.estado}</Text>
              </View>
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
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#B8D4D1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  profileIcon: {
    fontSize: 24,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 10,
  },
  tabActive: {
    backgroundColor: '#5BB5A2',
  },
  tabText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
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
  cardImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#E0E0E0',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  estadoBadge: {
    backgroundColor: '#F5B7B1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  estadoText: {
    fontSize: 13,
    color: '#C0392B',
    fontWeight: '600',
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
    color: '#5BB5A2',
    fontWeight: '600',
  },
});

export default InicioScreen;