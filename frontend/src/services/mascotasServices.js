import { mascotasAPI } from '../api/endpoints';

class MascotasService {
  // Obtener todas las mascotas
  async obtenerMascotas() {
    try {
      const result = await mascotasAPI.listar();
      
      // El backend devuelve { mascotas: [...] }, extraemos el array
      if (result.success && result.data.mascotas) {
        return {
          success: true,
          data: result.data.mascotas // Devolver solo el array de mascotas
        };
      }
      
      return result;
    } catch (error) {
      console.error('Error obteniendo mascotas:', error);
      return { success: false, error: 'Error al obtener mascotas' };
    }
  }

  // Crear nueva mascota
  async crearMascota(mascotaData, imagenUri = null) {
    try {
      const result = await mascotasAPI.crear(mascotaData, imagenUri);
      return result;
    } catch (error) {
      console.error('Error creando mascota:', error);
      return { success: false, error: 'Error al crear mascota' };
    }
  }

  // Actualizar mascota existente
  async actualizarMascota(mascotaId, mascotaData, imagenUri = null) {
    try {
      const result = await mascotasAPI.actualizar(mascotaId, mascotaData, imagenUri);
      return result;
    } catch (error) {
      console.error('Error actualizando mascota:', error);
      return { success: false, error: 'Error al actualizar mascota' };
    }
  }

  // Eliminar mascota
  async eliminarMascota(mascotaId) {
    try {
      const result = await mascotasAPI.eliminar(mascotaId);
      return result;
    } catch (error) {
      console.error('Error eliminando mascota:', error);
      return { success: false, error: 'Error al eliminar mascota' };
    }
  }

  // Obtener URL completa de la imagen
  getImageUrl(imagePath) {
    if (!imagePath) return null;
    
    // Si ya es una URL completa, retornarla
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Construir URL completa desde el backend
    const baseUrl = __DEV__ 
      ? process.env.NGROK_URL 
      : 'https://mismascotasApp.com';
    return `${baseUrl}${imagePath}`;
  }
  async buscarMatch(mascotaId) {
    try {
      const result = await mascotasAPI.match(mascotaId);
      return result;
    } catch (error) {
      console.error("Error obteniendo match:", error);
      return { success: false, error: "Error al obtener coincidencias" };
    }
  }
}

export default new MascotasService();