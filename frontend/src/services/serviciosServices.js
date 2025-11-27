import { serviciosAPI } from '../api/endpoints';

const serviciosServices = {

  listar: async () => {
    const response = await serviciosAPI.listar();
    return response.data;
  },

  crear: async (data, imagenURI) => {
    const response = await serviciosAPI.crear(data, imagenURI);
    return response.data;
  },

  actualizar: async (servicioId, data, imagenURI) => {
    const response = await serviciosAPI.actualizar(servicioId, data, imagenURI);
    return response.data;
  },

  eliminar: async (servicioId) => {
    const response = await serviciosAPI.eliminar(servicioId);
    return response.data;
  }

};

export default serviciosServices;
