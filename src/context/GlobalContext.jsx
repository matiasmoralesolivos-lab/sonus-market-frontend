
import { createContext, useState, useEffect } from 'react';

import {
  registrarUsuarioAPI,
  iniciarSesionAPI,
  obtenerPerfilAPI,
  obtenerPublicacionesAPI,
  crearPublicacionAPI,
  actualizarPublicacionAPI,
} from '../services/api';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  const [token, setToken] = useState(
    () => localStorage.getItem('token')
  );

  const [publicaciones, setPublicaciones] = useState([]);
  const [cargandoPublicaciones, setCargandoPublicaciones] = useState(false);

  // Recuperar sesión al iniciar o actualizar la aplicación
  useEffect(() => {
    const recuperarSesion = async () => {
      if (!token) {
        setUsuario(null);
        return;
      }

      try {
        const datos = await obtenerPerfilAPI(token);
        setUsuario(datos.usuario);
      } catch (error) {
        console.error('No se pudo recuperar la sesión:', error.message);

        localStorage.removeItem('token');
        setToken(null);
        setUsuario(null);
      }
    };

    recuperarSesion();
  }, [token]);

  // Registrar un usuario
  const registrarUsuario = async (nombre, email, password) => {
    return await registrarUsuarioAPI({
      nombre,
      email,
      password,
    });
  };

  // Iniciar sesión
  const iniciarSesion = async (email, password) => {
    const datos = await iniciarSesionAPI({
      email,
      password,
    });

    localStorage.setItem('token', datos.token);

    setToken(datos.token);
    setUsuario(datos.usuario);

    return datos.usuario;
  };

  // Recuperar el perfil
  const cargarPerfil = async () => {
    if (!token) return null;

    try {
      const datos = await obtenerPerfilAPI(token);
      setUsuario(datos.usuario);
      return datos.usuario;
    } catch (error) {
      cerrarSesion();
      throw error;
    }
  };

  // Cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
  };

  // Obtener publicaciones desde PostgreSQL
  const cargarPublicaciones = async () => {
    setCargandoPublicaciones(true);

    try {
      const datos = await obtenerPublicacionesAPI();
      setPublicaciones(datos);
      return datos;
    } catch (error) {
      console.error('Error al cargar publicaciones:', error.message);
      throw error;
    } finally {
      setCargandoPublicaciones(false);
    }
  };

  // Crear publicación en PostgreSQL
  const agregarPublicacion = async (nuevaPublicacion) => {
    if (!token) {
      throw new Error('Debes iniciar sesión para publicar');
    }

    const publicacionCreada = await crearPublicacionAPI(
      nuevaPublicacion,
      token
    );

    setPublicaciones((prevPublicaciones) => [
      publicacionCreada,
      ...prevPublicaciones,
    ]);

    return publicacionCreada;
  };

  // Actualizar publicación en PostgreSQL
  const editarPublicacion = async (id, datosActualizados) => {
    if (!token) {
      throw new Error('Debes iniciar sesión para editar una publicación');
    }

    const publicacionActualizada = await actualizarPublicacionAPI(
      id,
      datosActualizados,
      token
    );

    setPublicaciones((prevPublicaciones) =>
      prevPublicaciones.map((publicacion) =>
        Number(publicacion.id) === Number(id)
          ? publicacionActualizada
          : publicacion
      )
    );

    return publicacionActualizada;
  };

  return (
    <GlobalContext.Provider
      value={{
        usuario,
        token,
        publicaciones,
        cargandoPublicaciones,
        registrarUsuario,
        iniciarSesion,
        cargarPerfil,
        cerrarSesion,
        cargarPublicaciones,
        agregarPublicacion,
        editarPublicacion,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
