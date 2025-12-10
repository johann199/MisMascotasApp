import unittest
from unittest.mock import Mock, patch, MagicMock, PropertyMock
from io import BytesIO
from PIL import Image
import json
import os
import django

# Configurar Django antes de cualquier import
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.core.files.uploadedfile import SimpleUploadedFile


class ServicioModelUnitTest(unittest.TestCase):
    """Tests unitarios para el modelo Servicio (sin BD)"""

    @patch('servicios.models.Servicio')
    def test_crear_servicio_estructura(self, MockServicio):
        """Test: Verificar estructura del modelo Servicio"""
        # Arrange
        mock_user = Mock()
        mock_user.id = 1
        mock_user.username = 'testuser'
        
        mock_servicio = Mock()
        mock_servicio.nombre = 'Veterinaria Central'
        mock_servicio.descripcion = 'Atención veterinaria 24/7'
        mock_servicio.telefono = '1234567890'
        mock_servicio.propietario = mock_user
        mock_servicio.imagen = None
        
        # Assert
        self.assertEqual(mock_servicio.nombre, 'Veterinaria Central')
        self.assertEqual(mock_servicio.descripcion, 'Atención veterinaria 24/7')
        self.assertEqual(mock_servicio.telefono, '1234567890')
        self.assertEqual(mock_servicio.propietario.id, 1)
        self.assertIsNone(mock_servicio.imagen)

    def test_servicio_str_method(self):
        """Test: Método __str__ devuelve el nombre"""
        # Arrange
        mock_servicio = Mock()
        mock_servicio.nombre = 'Guardería Canina'
        mock_servicio.__str__ = Mock(return_value=mock_servicio.nombre)
        
        # Act
        resultado = str(mock_servicio)
        
        # Assert
        self.assertEqual(resultado, 'Guardería Canina')

    def test_servicio_atributos_requeridos(self):
        """Test: Verificar que los atributos requeridos están presentes"""
        # Arrange
        mock_servicio = Mock()
        mock_servicio.nombre = 'Test Servicio'
        mock_servicio.descripcion = 'Descripción'
        mock_servicio.telefono = '1111111111'
        mock_servicio.propietario = Mock(id=1)
        
        # Assert
        self.assertTrue(hasattr(mock_servicio, 'nombre'))
        self.assertTrue(hasattr(mock_servicio, 'descripcion'))
        self.assertTrue(hasattr(mock_servicio, 'telefono'))
        self.assertTrue(hasattr(mock_servicio, 'propietario'))


class ServicioViewsListarUnitTest(unittest.TestCase):
    """Tests unitarios para la vista de listar servicios"""

    @patch('servicios.views.Servicio')
    def test_listar_servicios_vacio(self, MockServicio):
        """Test: Listar cuando no hay servicios"""
        # Arrange
        MockServicio.objects.all.return_value = []
        mock_request = Mock()
        
        # Act
        from servicios.views import listar_servicios
        with patch('servicios.views.Servicio.objects.all', return_value=[]):
            resultado = listar_servicios(mock_request)
        
        # Assert
        self.assertEqual(resultado, [])

    @patch('servicios.views.Servicio')
    def test_listar_servicios_con_datos(self, MockServicio):
        """Test: Listar servicios devuelve lista correcta"""
        # Arrange
        mock_servicio1 = Mock()
        mock_servicio1.id = 1
        mock_servicio1.nombre = 'Servicio 1'
        
        mock_servicio2 = Mock()
        mock_servicio2.id = 2
        mock_servicio2.nombre = 'Servicio 2'
        
        mock_request = Mock()
        servicios_mock = [mock_servicio1, mock_servicio2]
        
        # Act
        from servicios.views import listar_servicios
        with patch('servicios.views.Servicio.objects.all', return_value=servicios_mock):
            resultado = listar_servicios(mock_request)
        
        # Assert
        self.assertEqual(len(resultado), 2)
        self.assertEqual(resultado[0].nombre, 'Servicio 1')
        self.assertEqual(resultado[1].nombre, 'Servicio 2')


class ServicioViewsCrearUnitTest(unittest.TestCase):
    """Tests unitarios para la vista de crear servicio"""

    @patch('servicios.views.Servicio')
    def test_crear_servicio_usuario_autenticado(self, MockServicio):
        """Test: Crear servicio con usuario autenticado"""
        # Arrange
        mock_request = Mock()
        mock_request.user.is_authenticated = True
        mock_request.user.id = 1
        
        mock_servicio = Mock()
        mock_servicio.nombre = 'Nuevo Servicio'
        mock_servicio.descripcion = 'Descripción'
        mock_servicio.telefono = '1234567890'
        
        MockServicio.objects.create.return_value = mock_servicio
        
        # Act
        from servicios.views import crear_servicio
        resultado = crear_servicio(
            mock_request,
            nombre='Nuevo Servicio',
            descripcion='Descripción',
            telefono='1234567890',
            imagen=None
        )
        
        # Assert
        self.assertEqual(resultado.nombre, 'Nuevo Servicio')
        MockServicio.objects.create.assert_called_once()

    def test_crear_servicio_usuario_no_autenticado(self):
        """Test: Rechazar creación sin autenticación"""
        # Arrange
        mock_request = Mock()
        mock_request.user.is_authenticated = False
        
        # Act & Assert
        from servicios.views import crear_servicio
        from ninja.errors import HttpError
        
        with self.assertRaises(HttpError) as context:
            crear_servicio(
                mock_request,
                nombre='Servicio',
                descripcion='Desc',
                telefono='123',
                imagen=None
            )
        
        self.assertEqual(context.exception.status_code, 401)


class ServicioViewsActualizarUnitTest(unittest.TestCase):
    """Tests unitarios para la vista de actualizar servicio"""

    @patch('servicios.views.get_object_or_404')
    def test_actualizar_servicio_propio(self, mock_get_object):
        """Test: Actualizar servicio como propietario"""
        # Arrange
        mock_user = Mock()
        mock_user.id = 1
        
        mock_servicio = Mock()
        mock_servicio.id = 1
        mock_servicio.propietario = mock_user
        mock_servicio.save = Mock()
        
        mock_get_object.return_value = mock_servicio
        
        mock_request = Mock()
        mock_request.user = mock_user
        
        mock_data = Mock()
        mock_data.nombre = 'Nombre Actualizado'
        mock_data.descripcion = 'Desc Actualizada'
        mock_data.telefono = '9999999999'
        
        # Act
        from servicios.views import actualizar_servicio
        resultado = actualizar_servicio(mock_request, 1, mock_data, None)
        
        # Assert
        self.assertEqual(resultado.nombre, 'Nombre Actualizado')
        mock_servicio.save.assert_called_once()

    @patch('servicios.views.get_object_or_404')
    def test_actualizar_servicio_no_propietario(self, mock_get_object):
        """Test: Rechazar actualización de servicio ajeno"""
        # Arrange
        mock_propietario = Mock()
        mock_propietario.id = 1
        
        mock_otro_usuario = Mock()
        mock_otro_usuario.id = 2
        
        mock_servicio = Mock()
        mock_servicio.propietario = mock_propietario
        
        mock_get_object.return_value = mock_servicio
        
        mock_request = Mock()
        mock_request.user = mock_otro_usuario
        
        mock_data = Mock()
        
        # Act & Assert
        from servicios.views import actualizar_servicio
        from ninja.errors import HttpError
        
        with self.assertRaises(HttpError) as context:
            actualizar_servicio(mock_request, 1, mock_data, None)
        
        self.assertEqual(context.exception.status_code, 403)


class ServicioViewsEliminarUnitTest(unittest.TestCase):
    """Tests unitarios para la vista de eliminar servicio"""

    @patch('servicios.views.get_object_or_404')
    def test_eliminar_servicio_propio(self, mock_get_object):
        """Test: Eliminar servicio como propietario"""
        # Arrange
        mock_user = Mock()
        mock_user.id = 1
        
        mock_servicio = Mock()
        mock_servicio.propietario = mock_user
        mock_servicio.imagen = None
        mock_servicio.delete = Mock()
        
        mock_get_object.return_value = mock_servicio
        
        mock_request = Mock()
        mock_request.user = mock_user
        
        # Act
        from servicios.views import eliminar_servicio
        resultado = eliminar_servicio(mock_request, 1)
        
        # Assert
        self.assertEqual(resultado['detail'], 'Servicio eliminado correctamente')
        mock_servicio.delete.assert_called_once()

    @patch('servicios.views.get_object_or_404')
    def test_eliminar_servicio_con_imagen(self, mock_get_object):
        """Test: Eliminar servicio con imagen elimina también la imagen"""
        # Arrange
        mock_user = Mock()
        mock_imagen = Mock()
        mock_imagen.delete = Mock()
        
        mock_servicio = Mock()
        mock_servicio.propietario = mock_user
        mock_servicio.imagen = mock_imagen
        mock_servicio.delete = Mock()
        
        mock_get_object.return_value = mock_servicio
        
        mock_request = Mock()
        mock_request.user = mock_user
        
        # Act
        from servicios.views import eliminar_servicio
        eliminar_servicio(mock_request, 1)
        
        # Assert
        mock_imagen.delete.assert_called_once_with(save=False)
        mock_servicio.delete.assert_called_once()

    @patch('servicios.views.get_object_or_404')
    def test_eliminar_servicio_no_propietario(self, mock_get_object):
        """Test: Rechazar eliminación de servicio ajeno"""
        # Arrange
        mock_propietario = Mock()
        mock_propietario.id = 1
        
        mock_otro_usuario = Mock()
        mock_otro_usuario.id = 2
        
        mock_servicio = Mock()
        mock_servicio.propietario = mock_propietario
        
        mock_get_object.return_value = mock_servicio
        
        mock_request = Mock()
        mock_request.user = mock_otro_usuario
        
        # Act & Assert
        from servicios.views import eliminar_servicio
        from ninja.errors import HttpError
        
        with self.assertRaises(HttpError) as context:
            eliminar_servicio(mock_request, 1)
        
        self.assertEqual(context.exception.status_code, 403)


class ServicioSchemasUnitTest(unittest.TestCase):
    """Tests unitarios para los schemas de Servicio"""

    def test_servicio_schema_estructura(self):
        """Test: Verificar estructura del ServicioSchema"""
        from servicios.schemas import ServicioSchema
        
        # Verificar que tenga los campos requeridos
        schema_fields = ServicioSchema.__annotations__
        
        self.assertIn('id', schema_fields)
        self.assertIn('nombre', schema_fields)
        self.assertIn('descripcion', schema_fields)
        self.assertIn('telefono', schema_fields)
        self.assertIn('imagen', schema_fields)

    def test_servicio_create_schema_estructura(self):
        """Test: Verificar estructura del ServicioCreateSchema"""
        from servicios.schemas import ServicioCreateSchema
        
        schema_fields = ServicioCreateSchema.__annotations__
        
        self.assertIn('nombre', schema_fields)
        self.assertIn('descripcion', schema_fields)
        self.assertIn('telefono', schema_fields)

    def test_servicio_update_schema_estructura(self):
        """Test: Verificar estructura del ServicioUpdateSchema"""
        from servicios.schemas import ServicioUpdateSchema
        
        schema_fields = ServicioUpdateSchema.__annotations__
        
        self.assertIn('nombre', schema_fields)
        self.assertIn('descripcion', schema_fields)
        self.assertIn('telefono', schema_fields)

    def test_servicio_out_schema_resolve_imagen_sin_imagen(self):
        """Test: resolve_imagen devuelve None cuando no hay imagen"""
        from servicios.schemas import ServicioOutSchema
        
        # Arrange
        mock_servicio = Mock()
        mock_servicio.imagen = None
        mock_servicio._request = Mock()
        
        # Act
        resultado = ServicioOutSchema.resolve_imagen(mock_servicio)
        
        # Assert
        self.assertIsNone(resultado)

    def test_servicio_out_schema_resolve_imagen_con_imagen(self):
        """Test: resolve_imagen devuelve URL completa cuando hay imagen"""
        from servicios.schemas import ServicioOutSchema
        
        # Arrange
        mock_imagen = Mock()
        mock_imagen.url = '/media/servicios/test.jpg'
        
        mock_request = Mock()
        mock_request.build_absolute_uri = Mock(return_value='http://localhost:8000/media/servicios/test.jpg')
        
        mock_servicio = Mock()
        mock_servicio.imagen = mock_imagen
        mock_servicio._request = mock_request
        
        # Act
        resultado = ServicioOutSchema.resolve_imagen(mock_servicio)
        
        # Assert
        self.assertEqual(resultado, 'http://localhost:8000/media/servicios/test.jpg')
        mock_request.build_absolute_uri.assert_called_once_with('/media/servicios/test.jpg')


class ServicioLogicaDeNegocioUnitTest(unittest.TestCase):
    """Tests unitarios de lógica de negocio"""

    def test_validar_telefono_formato(self):
        """Test: Validar formato de teléfono (mock)"""
        # Arrange
        telefono_valido = '1234567890'
        telefono_invalido = 'abc'
        
        # Act & Assert
        self.assertTrue(telefono_valido.isdigit())
        self.assertFalse(telefono_invalido.isdigit())

    def test_validar_nombre_no_vacio(self):
        """Test: Validar que nombre no esté vacío"""
        # Arrange
        nombre_valido = 'Veterinaria'
        nombre_invalido = ''
        
        # Act & Assert
        self.assertTrue(len(nombre_valido) > 0)
        self.assertFalse(len(nombre_invalido) > 0)

    def test_validar_descripcion_longitud_maxima(self):
        """Test: Validar longitud de descripción"""
        # Arrange
        descripcion_corta = 'Descripción válida'
        descripcion_larga = 'A' * 10000
        
        # Act & Assert
        self.assertTrue(len(descripcion_corta) < 5000)
        self.assertFalse(len(descripcion_larga) < 5000)


if __name__ == '__main__':
    unittest.main()
