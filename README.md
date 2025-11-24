
# Aplicación de sistema de reservas de canchas [FRONTEND]


Aplicación web desarrollada con React + Vite para gestionar reservas de canchas deportivas.  
Este frontend permite que usuarios, propietarios y administradores interactúen con el sistema de forma dinámica y segura.

## Descripción del proyecto
Este sistema resuelve la gestión manual de reservas proporcionando una plataforma web donde:

- Los **usuarios** pueden registrarse, iniciar sesión, buscar canchas, hacer reservas y solicitar un cambio de rol si lo desean.
- Los **propietarios** pueden administrar sus propios lugares, canchas y reservas.
- Los **administradores** pueden gestionar usuarios, solicitudes, ver todas las reservas, lugares y canchas existentes.


## Tecnologías utilizadas

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- DaisyUI


## Estructura del proyecto

```bash
src/
├── assets/          # Recursos estáticos (imágenes, íconos)
├── components/      # Componentes reutilizables
├── context/         # Contexto globale (Auth)
├── layouts/         # Layouts generales para usuario y admin
├── pages/           # Páginas divididas por tipo de usuario
│   ├── admin/       # Vistas del administrador
|   ├── propietario/ # Vistas del propietario
│   └── usuario/     # Vistas del cliente
│       ├── Home.jsx
│       ├── InfoCanchitas.jsx
│       ├── InicioSesion.jsx
│       └── Registro.jsx
├── routes/          # Definición de rutas (React Router)
├── App.jsx          # Componente principal
├── main.jsx         # Punto de entrada
└── index.css        # Estilos base

```

## Requisitos previos 

- Node.js v20.14
- npm  
- Docker Desktop (Windows/macOS)  
- Docker Engine (Linux)

## Instalación y ejecución

1. Levantar Docker Desktop

2. Clonar el repositorio 

```bash
  git clone https://github.com/JH074/proyecto_final_IS_frontend.git
  cd proyecto_final_IS_frontend
```

3. Instalar dependencias 

```bash
  npm install
```

4. Ejecutar la aplicación
   
   Con Docker 
```bash
  docker-compose up --build -d
```
Accedé a la app en http://localhost:3000

Sin Docker
```bash
  npm run dev
```
Accedé a la app en http://localhost:5173

## Funcionalidades 

Cliente

* Registro e inicio de sesión

* Listado de canchas por zona, lugar y tipo

* Formulario para hacer una reserva

* Visualización de "Mis Reservaciones" separadas por estado

Administrador

* Panel de usuarios

* Gestión de canchas y lugares (ver y eliminar)

* Visualización de reservas por estado y cancha
* Visualización de solicitudes por estado
* Aprobación y rechazo de solicitudes

Propietario

*  Gestión de canchas y lugares (crear, editar, eliminar)
*  Visualización de reservas por estado y cancha

[Repositorio de Backend](https://github.com/JH074/proyecto_final_IS_backend)
