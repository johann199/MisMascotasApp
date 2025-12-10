# MisMascotasApp
## Backend
1. Clonar el repositorio git clone url del proyecto
2. Ubicarse en la carpeta backend 
3. Ejecutar el crear el entorno virtual (.venv) este es recomendado el nombre pero no obligatorio.
4. Activar el entorno virtual: 
   - Para linux: source .venv/bin/activate
   - Para windows: .venv\Scripts\activate
5. Ejecutar el comando pip install -r requirements.txt

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


## Instalación react native
### Requisitos previos

- Node.js (LTS) instalado (versión LTS recomendada).

- npm (viene con Node) o yarn / pnpm (opcional).

- En macOS: Xcode para usar el simulador iOS (si vas a compilar localmente para iOS).

##### Comandos
- npm install: instala las dependencias del proyecto
- npx expo start: ejecuta la aplicación
##### Nota
- Los comandos anteriores deben ser ejecutados dentro de la carpeta frontend

###### Expo Go
- Descarga la app: Expo Go en tu dispositivo movil
- Al ejecutar npx expo start, saldra un QR, escanea desde la App y correra

### Doker file.

- Se agrega la imagen doker con la conexión a la base de datos
- instalar en la carpeta backend y dentro del entorno virtual psycopg2 con pip install, o ejecutar el comando para instalar los requerimientos de python.

##### Ejecutar la imagen Docker
- Ejecuta los comandos:
   - docker-compose down
   - docker-compose up -d
###### Nota:
- No cambiare el puerto, si no tienen mas contenedores con postgresSql, no va a presentar errores, y si el puerto 5434 no funciona, modifiquenlo al 35 o 36, pero con el 34 funciona bien, 
- Johann lo hace de esa forma porque tiene el postgres en el os y genera error en el puerto 5432 y a su vez tengo contenerores que ejecutan el puerto 5433 de postgres. 
- Si el puerto falla, ejecuten los siguientes comandos: 
   - docker stop mimascotasapp
   - docker rm mimascotasapp
   - docker-compose down -v
   - docker system prune -f
   #### Levanta la imagen de nuevo
   - docker-compose up -d

#### .env Backend
- crear un archivo .env en la carpeta backend con las siguientes variables: 
   DB_ENGINE=django.db.backends.postgresql
   DB_NAME=mimascotasapp
   DB_USER=admin
   DB_PASSWORD=admin1234
   DB_HOST=localhost
   DB_PORT=5434

   # Django Settings
   SECRET_KEY=
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1

   # Firebase
   FIREBASE_PROJECT_ID=mimascotasapp

   # Ngrok
   NGROK_URL= ingresar a ngrok y sacar la url del proyecto, sin el http

### .env Frontend
- Crear un archivo .env em la carpeta frontend y escribir las siguientes variables de entorno

NGROK_URL="ir a la url de ngrok para la url, aquí si debe ir con http"

Url de ngrok: https://ngrok.com/

## Tests

### Backend
**Ejecutar todos los tests:**
```bash
cd bakend
.venv\Scripts\activate
python -m unittest discover -s . -p "tests.py" -v
```

**Ejecutar tests de un módulo específico:**
```bash
# Tests de servicios
python -m unittest servicios.tests -v

# Tests de mascotas
python -m unittest mascotas.tests -v
```
### Frontend
```bash
cd frontend
npm test
```