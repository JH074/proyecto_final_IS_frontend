
# Aplicación de sistema de reservas de canchas [FRONTEND]


Interfaz web desarrollada con React + Vite para el sistema de reservas de canchas deportivas. Permite a los usuarios gestionar sus reservas y a los administradores controlar la disponibilidad y la gestión de canchas.


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

* Node.js v20.14

## Instalación y ejecución

1. Clonar el repositorio 

```bash
  git clone https://github.com/JH074/proyecto_final_IS_frontend.git
```

2. Instalar dependencias 

```bash
  npm install
```

3. Ejecutar la aplicación 
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

* Gestión de canchas y lugares

* Visualización de reservas por estado y cancha