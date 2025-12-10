import MascotasService from '../mascotasServices';
import { mascotasAPI } from '../../api/endpoints';

// Mock de mascotasAPI
jest.mock('../../api/endpoints', () => ({
  mascotasAPI: {
    listar: jest.fn(),
    crear: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn(),
    match: jest.fn(),
  }
}));

describe('MascotasService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obtenerMascotas', () => {
    it('debería obtener la lista de mascotas correctamente', async () => {
      const mockMascotas = [
        { id: 1, nombre: 'Rex', raza: 'Labrador' },
        { id: 2, nombre: 'Luna', raza: 'Pastor Alemán' }
      ];

      mascotasAPI.listar.mockResolvedValueOnce({
        success: true,
        data: { mascotas: mockMascotas }
      });

      const result = await MascotasService.obtenerMascotas();

      expect(mascotasAPI.listar).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockMascotas);
    });

    it('debería manejar respuesta sin mascotas', async () => {
      mascotasAPI.listar.mockResolvedValueOnce({
        success: true,
        data: {}
      });

      const result = await MascotasService.obtenerMascotas();

      expect(result.success).toBe(true);
    });

    it('debería manejar errores al obtener mascotas', async () => {
      mascotasAPI.listar.mockRejectedValueOnce(new Error('Network error'));

      const result = await MascotasService.obtenerMascotas();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error al obtener mascotas');
    });

    it('debería retornar error si el backend falla', async () => {
      mascotasAPI.listar.mockResolvedValueOnce({
        success: false,
        error: 'Error del servidor'
      });

      const result = await MascotasService.obtenerMascotas();

      expect(result.success).toBe(false);
    });
  });

  describe('crearMascota', () => {
    it('debería crear una mascota sin imagen', async () => {
      const mascotaData = {
        nombre: 'Max',
        raza: 'Golden Retriever',
        descripcion: 'Mascota perdida',
        dia: '2025-12-10',
        tipo_reporte: 'Perdida'
      };

      mascotasAPI.crear.mockResolvedValueOnce({
        success: true,
        data: { id: 3, ...mascotaData }
      });

      const result = await MascotasService.crearMascota(mascotaData);

      expect(mascotasAPI.crear).toHaveBeenCalledWith(mascotaData, null);
      expect(result.success).toBe(true);
      expect(result.data.nombre).toBe('Max');
    });

    it('debería crear una mascota con imagen', async () => {
      const mascotaData = {
        nombre: 'Bella',
        raza: 'Beagle'
      };
      const imagenUri = 'file://test/image.jpg';

      mascotasAPI.crear.mockResolvedValueOnce({
        success: true,
        data: { id: 4, ...mascotaData, imagen: imagenUri }
      });

      const result = await MascotasService.crearMascota(mascotaData, imagenUri);

      expect(mascotasAPI.crear).toHaveBeenCalledWith(mascotaData, imagenUri);
      expect(result.success).toBe(true);
    });

    it('debería manejar errores al crear mascota', async () => {
      mascotasAPI.crear.mockRejectedValueOnce(new Error('Creation error'));

      const result = await MascotasService.crearMascota({ nombre: 'Test' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error al crear mascota');
    });

    it('debería retornar error si el backend falla', async () => {
      mascotasAPI.crear.mockResolvedValueOnce({
        success: false,
        error: 'Datos inválidos'
      });

      const result = await MascotasService.crearMascota({ nombre: 'Test' });

      expect(result.success).toBe(false);
    });
  });

  describe('actualizarMascota', () => {
    it('debería actualizar una mascota correctamente', async () => {
      const mascotaId = 1;
      const updateData = { nombre: 'Rex Actualizado' };

      mascotasAPI.actualizar.mockResolvedValueOnce({
        success: true,
        data: { id: mascotaId, ...updateData }
      });

      const result = await MascotasService.actualizarMascota(mascotaId, updateData);

      expect(mascotasAPI.actualizar).toHaveBeenCalledWith(mascotaId, updateData, null);
      expect(result.success).toBe(true);
    });

    it('debería actualizar una mascota con nueva imagen', async () => {
      const mascotaId = 2;
      const updateData = { descripcion: 'Nueva descripción' };
      const imagenUri = 'file://new/image.jpg';

      mascotasAPI.actualizar.mockResolvedValueOnce({
        success: true,
        data: { id: mascotaId, ...updateData }
      });

      const result = await MascotasService.actualizarMascota(mascotaId, updateData, imagenUri);

      expect(mascotasAPI.actualizar).toHaveBeenCalledWith(mascotaId, updateData, imagenUri);
      expect(result.success).toBe(true);
    });

    it('debería manejar errores al actualizar', async () => {
      mascotasAPI.actualizar.mockRejectedValueOnce(new Error('Update error'));

      const result = await MascotasService.actualizarMascota(1, {});

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error al actualizar mascota');
    });
  });

  describe('eliminarMascota', () => {
    it('debería eliminar una mascota correctamente', async () => {
      const mascotaId = 5;

      mascotasAPI.eliminar.mockResolvedValueOnce({
        success: true,
        data: { message: 'Mascota eliminada' }
      });

      const result = await MascotasService.eliminarMascota(mascotaId);

      expect(mascotasAPI.eliminar).toHaveBeenCalledWith(mascotaId);
      expect(result.success).toBe(true);
    });

    it('debería manejar errores al eliminar', async () => {
      mascotasAPI.eliminar.mockRejectedValueOnce(new Error('Delete error'));

      const result = await MascotasService.eliminarMascota(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error al eliminar mascota');
    });

    it('debería retornar error si la mascota no existe', async () => {
      mascotasAPI.eliminar.mockResolvedValueOnce({
        success: false,
        error: 'Mascota no encontrada'
      });

      const result = await MascotasService.eliminarMascota(999);

      expect(result.success).toBe(false);
    });
  });

  describe('getImageUrl', () => {
    it('debería retornar null si no hay imagen', () => {
      const url = MascotasService.getImageUrl(null);
      expect(url).toBeNull();

      const url2 = MascotasService.getImageUrl('');
      expect(url2).toBeNull();
    });

    it('debería retornar la URL completa si ya comienza con http', () => {
      const fullUrl = 'https://example.com/image.jpg';
      const result = MascotasService.getImageUrl(fullUrl);
      expect(result).toBe(fullUrl);
    });

    it('debería construir URL en modo desarrollo', () => {
      // Simular modo desarrollo
      const originalDEV = global.__DEV__;
      global.__DEV__ = true;

      // Mock process.env.NGROK_URL
      process.env.NGROK_URL = 'http://test.ngrok.io';

      const imagePath = '/media/mascotas/image.jpg';
      const result = MascotasService.getImageUrl(imagePath);

      expect(result).toBe('http://test.ngrok.io/media/mascotas/image.jpg');

      global.__DEV__ = originalDEV;
    });

    it('debería construir URL en modo producción', () => {
      const originalDEV = global.__DEV__;
      global.__DEV__ = false;

      const imagePath = '/media/mascotas/image.jpg';
      const result = MascotasService.getImageUrl(imagePath);

      expect(result).toBe('https://mismascotasApp.com/media/mascotas/image.jpg');

      global.__DEV__ = originalDEV;
    });
  });

  describe('buscarMatch', () => {
    it('debería buscar coincidencias correctamente', async () => {
      const mascotaId = 10;
      const mockMatch = {
        mascotas: [
          { id: 11, nombre: 'Similar', raza: 'Labrador' }
        ],
        similitud: 95
      };

      mascotasAPI.match.mockResolvedValueOnce({
        success: true,
        data: mockMatch
      });

      const result = await MascotasService.buscarMatch(mascotaId);

      expect(mascotasAPI.match).toHaveBeenCalledWith(mascotaId);
      expect(result.success).toBe(true);
      expect(result.data.similitud).toBe(95);
    });

    it('debería manejar cuando no hay coincidencias', async () => {
      mascotasAPI.match.mockResolvedValueOnce({
        success: true,
        data: { mascotas: [], similitud: 0 }
      });

      const result = await MascotasService.buscarMatch(999);

      expect(result.success).toBe(true);
      expect(result.data.mascotas).toHaveLength(0);
    });

    it('debería manejar errores al buscar match', async () => {
      mascotasAPI.match.mockRejectedValueOnce(new Error('Match error'));

      const result = await MascotasService.buscarMatch(1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error al obtener coincidencias');
    });

    it('debería retornar error si el servicio falla', async () => {
      mascotasAPI.match.mockResolvedValueOnce({
        success: false,
        error: 'Servicio no disponible'
      });

      const result = await MascotasService.buscarMatch(1);

      expect(result.success).toBe(false);
    });
  });
});
