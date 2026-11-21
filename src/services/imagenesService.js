import { obtenerAutenticacionImagenesAPI } from './api';

// Subir una imagen directamente a ImageKit
export const subirImagenImageKit = async (archivo, token) => {
  // 1. Solicitar credenciales temporales al backend
  const autenticacion = await obtenerAutenticacionImagenesAPI(token);

  // 2. Preparar los datos de la imagen
  const formulario = new FormData();

  formulario.append('file', archivo);
  formulario.append('fileName', archivo.name);
  formulario.append('publicKey', autenticacion.publicKey);
  formulario.append('token', autenticacion.token);
  formulario.append('expire', autenticacion.expire);
  formulario.append('signature', autenticacion.signature);

  // 3. Enviar la imagen directamente a ImageKit
  const respuesta = await fetch(
    'https://upload.imagekit.io/api/v1/files/upload',
    {
      method: 'POST',
      body: formulario,
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.message || 'No se pudo subir la imagen');
  }

  // 4. Devolver la URL de la imagen
  return datos.url;
};