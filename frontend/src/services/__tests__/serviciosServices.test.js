import serviciosServices from '../serviciosServices';
import { serviciosAPI } from '../../api/endpoints';

// Mock de serviciosAPI
jest.mock('../../api/endpoints', () => ({
  serviciosAPI: {
    listar: jest.fn(),
    crear: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn(),
  }
}));

describe('ServiciosServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listar', () => {
    it('debería listar todos los servicios correctamente', async () => {
      const mockServicios = [
        {
          id: 1,
          nombre: 'Veterinaria Central',
          descripcion: 'Servicio veterinario completo',
          telefono: '123456789',
          imagen: 'http://example.com/vet.jpg'
        },
        {
          id: 2,
          nombre: 'Peluquería Canina',
          descripcion: 'Estética para mascotas',
          telefono: '987654321',
          imagen: 'http://example.com/grooming.jpg'
        }
      ];

      serviciosAPI.listar.mockResolvedValueOnce({
        success: true,
        data: mockServicios
      });

      const result = await serviciosServices.listar();

      expect(serviciosAPI.listar).toHaveBeenCalled();
      expect(result).toEqual(mockServicios);
      expect(result).toHaveLength(2);
    });

    it('debería retornar array vacío si no hay servicios', async () => {
      serviciosAPI.listar.mockResolvedValueOnce({
        success: true,
        data: []
      });

      const result = await serviciosServices.listar();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('debería manejar errores al listar', async () => {
      serviciosAPI.listar.mockRejectedValueOnce(new Error('Network error'));

      await expect(serviciosServices.listar()).rejects.toThrow('Network error');
    });

    it('debería retornar los datos incluso si success es false', async () => {
      const errorData = { error: 'Error del servidor' };
      
      serviciosAPI.listar.mockResolvedValueOnce({
        success: false,
        data: errorData
      });

      const result = await serviciosServices.listar();

      expect(result).toEqual(errorData);
    });
  });

  describe('crear', () => {
    it('debería crear un servicio sin imagen', async () => {
      const nuevoServicio = {
        nombre: 'Nueva Veterinaria',
        descripcion: 'Servicio de emergencias',
        telefono: '111222333'
      };

      const servicioCreado = { id: 3, ...nuevoServicio };

      serviciosAPI.crear.mockResolvedValueOnce({
        success: true,
        data: servicioCreado
      });

      const result = await serviciosServices.crear(nuevoServicio, null);

      expect(serviciosAPI.crear).toHaveBeenCalledWith(nuevoServicio, null);
      expect(result).toEqual(servicioCreado);
      expect(result.id).toBe(3);
    });

    it('debería crear un servicio con imagen', async () => {
      const nuevoServicio = {
        nombre: 'Guardería Canina',
        descripcion: 'Cuidado diario',
        telefono: '444555666'
      };
      const imagenURI = 'file://path/to/image.jpg';

      const servicioCreado = {
        id: 4,
        ...nuevoServicio,
        imagen: 'http://backend.com/media/servicios/image.jpg'
      };

      serviciosAPI.crear.mockResolvedValueOnce({
        success: true,
        data: servicioCreado
      });

      const result = await serviciosServices.crear(nuevoServicio, imagenURI);

      expect(serviciosAPI.crear).toHaveBeenCalledWith(nuevoServicio, imagenURI);
      expect(result).toEqual(servicioCreado);
      expect(result.imagen).toBeDefined();
    });

    it('debería manejar errores al crear servicio', async () => {
      const nuevoServicio = { nombre: 'Test' };
      
      serviciosAPI.crear.mockRejectedValueOnce(new Error('Creation failed'));

      await expect(serviciosServices.crear(nuevoServicio)).rejects.toThrow('Creation failed');
    });

    it('debería retornar datos de error si falla en backend', async () => {
      const errorData = { error: 'Datos inválidos' };
      
      serviciosAPI.crear.mockResolvedValueOnce({
        success: false,
        data: errorData
      });

      const result = await serviciosServices.crear({ nombre: 'Test' });

      expect(result).toEqual(errorData);
    });
  });

  describe('actualizar', () => {
    it('debería actualizar un servicio sin cambiar imagen', async () => {
      const servicioId = 5;
      const datosActualizados = {
        nombre: 'Veterinaria Actualizada',
        descripcion: 'Nueva descripción'
      };

      const servicioActualizado = {
        id: servicioId,
        ...datosActualizados,
        telefono: '999888777',
        imagen: 'http://example.com/old-image.jpg'
      };

      serviciosAPI.actualizar.mockResolvedValueOnce({
        success: true,
        data: servicioActualizado
      });

      const result = await serviciosServices.actualizar(servicioId, datosActualizados, null);

      expect(serviciosAPI.actualizar).toHaveBeenCalledWith(servicioId, datosActualizados, null);
      expect(result).toEqual(servicioActualizado);
      expect(result.nombre).toBe('Veterinaria Actualizada');
    });

    it('debería actualizar un servicio con nueva imagen', async () => {
      const servicioId = 6;
      const datosActualizados = { descripcion: 'Cambio de descripción' };
      const nuevaImagenURI = 'file://path/to/new-image.jpg';

      serviciosAPI.actualizar.mockResolvedValueOnce({
        success: true,
        data: {
          id: servicioId,
          ...datosActualizados,
          imagen: 'http://backend.com/media/new-image.jpg'
        }
      });

      const result = await serviciosServices.actualizar(
        servicioId,
        datosActualizados,
        nuevaImagenURI
      );

      expect(serviciosAPI.actualizar).toHaveBeenCalledWith(
        servicioId,
        datosActualizados,
        nuevaImagenURI
      );
      expect(result.imagen).toBe('http://backend.com/media/new-image.jpg');
    });

    it('debería manejar errores al actualizar', async () => {
      serviciosAPI.actualizar.mockRejectedValueOnce(new Error('Update failed'));

      await expect(
        serviciosServices.actualizar(999, { nombre: 'Test' })
      ).rejects.toThrow('Update failed');
    });

    it('debería retornar error si el servicio no existe', async () => {
      serviciosAPI.actualizar.mockResolvedValueOnce({
        success: false,
        data: { error: 'Servicio no encontrado' }
      });

      const result = await serviciosServices.actualizar(999, { nombre: 'Test' });

      expect(result.error).toBe('Servicio no encontrado');
    });
  });

  describe('eliminar', () => {
    it('debería eliminar un servicio correctamente', async () => {
      const servicioId = 7;

      serviciosAPI.eliminar.mockResolvedValueOnce({
        success: true,
        data: { message: 'Servicio eliminado correctamente' }
      });

      const result = await serviciosServices.eliminar(servicioId);

      expect(serviciosAPI.eliminar).toHaveBeenCalledWith(servicioId);
      expect(result.message).toBe('Servicio eliminado correctamente');
    });

    it('debería manejar errores al eliminar', async () => {
      serviciosAPI.eliminar.mockRejectedValueOnce(new Error('Delete failed'));

      await expect(serviciosServices.eliminar(999)).rejects.toThrow('Delete failed');
    });

    it('debería retornar error si el servicio no existe', async () => {
      serviciosAPI.eliminar.mockResolvedValueOnce({
        success: false,
        data: { error: 'Servicio no encontrado' }
      });

      const result = await serviciosServices.eliminar(999);

      expect(result.error).toBe('Servicio no encontrado');
    });

    it('debería manejar respuesta vacía', async () => {
      serviciosAPI.eliminar.mockResolvedValueOnce({
        success: true,
        data: {}
      });

      const result = await serviciosServices.eliminar(8);

      expect(result).toEqual({});
    });
  });

  describe('Integración - Flujo completo', () => {
    it('debería crear, actualizar y eliminar un servicio', async () => {
      // 1. Crear servicio
      const nuevoServicio = {
        nombre: 'Test Veterinaria',
        descripcion: 'Test',
        telefono: '123456789'
      };

      serviciosAPI.crear.mockResolvedValueOnce({
        success: true,
        data: { id: 100, ...nuevoServicio }
      });

      const creado = await serviciosServices.crear(nuevoServicio);
      expect(creado.id).toBe(100);

      // 2. Actualizar servicio
      const actualizacion = { nombre: 'Veterinaria Actualizada' };
      
      serviciosAPI.actualizar.mockResolvedValueOnce({
        success: true,
        data: { id: 100, ...nuevoServicio, ...actualizacion }
      });

      const actualizado = await serviciosServices.actualizar(100, actualizacion);
      expect(actualizado.nombre).toBe('Veterinaria Actualizada');

      // 3. Eliminar servicio
      serviciosAPI.eliminar.mockResolvedValueOnce({
        success: true,
        data: { message: 'Eliminado' }
      });

      const eliminado = await serviciosServices.eliminar(100);
      expect(eliminado.message).toBe('Eliminado');
    });
  });
});
