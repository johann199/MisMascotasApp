import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import mascotasServices from '../services/mascotasServices';

const InicioScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    cargarMascotas();
  }, []);

  const cargarMascotas = async () => {
    setLoading(true);
    const result = await mascotasServices.obtenerMascotas();
    
    if (result.success) {
      setMascotas(result.data);
    } else {
      console.error('Error cargando mascotas:', result.error);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarMascotas();
    setRefreshing(false);
  };

  // Filtrar mascotas según el tab seleccionado y búsqueda
  const mascotasFiltradas = mascotas.filter(mascota => {
    // Filtro por búsqueda
    const matchSearch = mascota.nombre
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    // Filtro por tab
    let matchTab = true;
    if (selectedTab === 'Perdidos') {
      matchTab = mascota.tipo_reporte === 'Pérdida';
    } else if (selectedTab === 'Encontrados') {
      matchTab = mascota.tipo_reporte === 'Encontrada';
    }
    // 'Todos' y 'Raza' por ahora muestran todo
    
    return matchSearch && matchTab;
  });

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
          style={styles.profileButton}
          onPress={() => navigation.navigate('Perfil')}
        >
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
          style={[styles.tab, selectedTab === 'Perdidos' && styles.tabActive]}
          onPress={() => setSelectedTab('Perdidos')}
        >
          <Text style={[styles.tabText, selectedTab === 'Perdidos' && styles.tabTextActive]}>
            Perdidos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de mascotas */}
      {loading && mascotas.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5BB5A2" />
          <Text style={styles.loadingText}>Cargando mascotas...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#5BB5A2']}
            />
          }
        >
          {mascotasFiltradas.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery 
                  ? 'No se encontraron mascotas con ese nombre' 
                  : 'No hay mascotas registradas'}
              </Text>
            </View>
          ) : (
            mascotasFiltradas.map((mascota) => (
              <TouchableOpacity 
                key={mascota.id} 
                style={styles.card}
                onPress={() => navigation.navigate('DetalleMascota', { mascota })}
                activeOpacity={0.7}
              >
                {mascota.imagen ? (
                  <Image 
                    source={{ uri: mascotasServices.getImageUrl(mascota.imagen) }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.cardImage, styles.placeholderImage]}>
                    <Text style={styles.placeholderText}>🐾</Text>
                  </View>
                )}
                <View style={styles.cardFooter}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{mascota.nombre}</Text>
                    <Text style={styles.cardDescription}>
                      {mascota.especie && mascota.raza 
                        ? `${mascota.especie} • ${mascota.raza}` 
                        : mascota.especie || mascota.raza || 'Sin información'}
                    </Text>
                    {mascota.edad && (
                      <Text style={styles.cardAge}>{mascota.edad} años</Text>
                    )}
                  </View>
                  <View style={[
                    styles.estadoBadge,
                    mascota.tipo_reporte === 'Encontrada' && styles.estadoBadgeEncontrada
                  ]}>
                    <Text style={[
                      styles.estadoText,
                      mascota.tipo_reporte === 'Encontrada' && styles.estadoTextEncontrada
                    ]}>
                      {mascota.tipo_reporte}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
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
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 80,
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
    marginBottom: 2,
  },
  cardAge: {
    fontSize: 13,
    color: '#999',
  },
  estadoBadge: {
    backgroundColor: '#F5B7B1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  estadoBadgeEncontrada: {
    backgroundColor: '#A9DFBF',
  },
  estadoText: {
    fontSize: 13,
    color: '#C0392B',
    fontWeight: '600',
  },
  estadoTextEncontrada: {
    color: '#229954',
  },
});

export default InicioScreen;