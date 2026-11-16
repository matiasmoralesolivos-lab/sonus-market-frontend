const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Función general para realizar peticiones al backend
const solicitar = async (endpoint, opciones = {}) => {
  const respuesta = await fetch(`${API_URL}${endpoint}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...opciones.headers,
    },
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || 'Error en la solicitud');
  }

  return datos;
};

// Registrar un usuario
export const registrarUsuarioAPI = (usuario) => {
  return solicitar('/usuarios', {
    method: 'POST',
    body: JSON.stringify(usuario),
  });
};

// Iniciar sesión
export const iniciarSesionAPI = (credenciales) => {
  return solicitar('/login', {
    method: 'POST',
    body: JSON.stringify(credenciales),
  });
};

// Obtener perfil del usuario autenticado
export const obtenerPerfilAPI = (token) => {
  return solicitar('/perfil', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Obtener todas las publicaciones
export const obtenerPublicacionesAPI = () => {
  return solicitar('/publicaciones');
};

// Obtener una publicación por ID
export const obtenerPublicacionAPI = (id) => {
  return solicitar(`/publicaciones/${id}`);
};

// Crear una publicación
export const crearPublicacionAPI = (publicacion, token) => {
  return solicitar('/publicaciones', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(publicacion),
  });
};
