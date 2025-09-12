# MisMascotasApp
## Backend
1. Clonar el repositorio git clone url del proyecto
2. Ubicarse en la carpeta backend 
3. Ejecutar el crear el entorno virtual (.venv) este es recomendado el nombre pero no obligatorio.
4. Activar el entorno virtual: 
   - Para linux: source .venv/bin/activate
   - Para windows: .venv\Scripts\activate
5. Ejecutar el comando pip install -r requirements.tx

### Instalaciones iniciales que se realizaran en el backend
1. Se instalara la libreria de firebase para interactuar con el administrador de firebase.
2. Se instalara django-ninja, que es una libreria que permite tener todo el orm de django para la gestión de la base de datos, sin embargo las rutas y el core del funcionamiento esta basado en FastApi.
   - Para mas información del django-ninja leer la documentación: https://django-ninja.dev/

**Nota:** 
- Recordar generar el token de git para hacer los push
- Cada commit se debe nomenclar asi añoMesDia-Nombre o iniciales del desarrollador:
  - Ejemplo: 20250912-Johann o 20250912-JAGG
  - Posteriormente lo que se desarrolla o se quiere subir al repo.
## GitFlow - Manejo de Ramas
### Estructura de Ramas
El proyecto utilizará GitFlow para organizar el desarrollo de manera eficiente:
**Ramas principales:**
- `main` - Rama de producción con código estable
- `develop` - Rama de integración para desarrollo activo
**Ramas de soporte:**
- `feature/nombre-funcionalidad` - Para desarrollar nuevas características (Debe salir de develop)
- `hotfix/descripcion-fix` - Para correcciones urgentes en producción (Debe salir de main)
