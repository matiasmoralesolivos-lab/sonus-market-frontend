
import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  solicitarRecuperacionAPI,
  restablecerPasswordAPI,
} from '../services/api';

function RecuperarPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSolicitar = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    setCargando(true);

    try {
      const respuesta = await solicitarRecuperacionAPI(email);
      setMensaje(respuesta.mensaje);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  const handleRestablecer = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setCargando(true);

    try {
      const respuesta = await restablecerPasswordAPI(token, password);
      setMensaje(respuesta.mensaje);

      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-8 col-md-5 col-lg-4">
            <div className="border rounded-4 p-4">
              <h1 className="h3 text-center mb-4">
                {token ? 'Restablecer contraseña' : 'Recuperar contraseña'}
              </h1>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {mensaje && (
                <div className="alert alert-success" role="alert">
                  {mensaje}
                </div>
              )}

              {!token ? (
                <form onSubmit={handleSolicitar}>
                  <p className="text-muted small">
                    Ingresa tu correo electrónico y te enviaremos
                    instrucciones para recuperar tu contraseña.
                  </p>

                  <div className="mb-3">
                    <label className="form-label">
                      Correo electrónico
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      placeholder="correo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark w-100"
                    disabled={cargando}
                  >
                    {cargando ? 'Enviando...' : 'Enviar instrucciones'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRestablecer}>
                  <div className="mb-3">
                    <label className="form-label">
                      Nueva contraseña
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={8}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Confirmar contraseña
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      value={confirmarPassword}
                      onChange={(e) => setConfirmarPassword(e.target.value)}
                      minLength={8}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark w-100"
                    disabled={cargando}
                  >
                    {cargando ? 'Actualizando...' : 'Cambiar contraseña'}
                  </button>
                </form>
              )}

              <p className="text-center small mt-4 mb-0">
                <Link to="/login">Volver al inicio de sesión</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default RecuperarPassword;
