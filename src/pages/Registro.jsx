
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import Navbar from "../components/Navbar";
import { GoogleLogin } from "@react-oauth/google";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const { registrarUsuario, iniciarSesionGoogle } =
    useContext(GlobalContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (password.length < 8 || password.length > 64) {
      setError("La contraseña debe tener entre 8 y 64 caracteres.");
      return;
    }

    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("La contraseña debe contener al menos una letra y un número.");
      return;
    }

    if (/\s/.test(password)) {
      setError("La contraseña no puede contener espacios.");
      return;
    }

    setCargando(true);

    try {
      await registrarUsuario(nombre, email, password);
      navigate("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    setError("");
    setCargando(true);

    try {
      await iniciarSesionGoogle(response.credential);
      navigate("/perfil");
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
              <h1 className="h3 text-center mb-4">Crear cuenta</h1>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre completo</label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contraseña</label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    maxLength={64}
                    required
                  />

                  <div className="form-text">
                    Entre 8 y 64 caracteres, con al menos una letra y un número,
                    sin espacios.
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100"
                  disabled={cargando}
                >
                  {cargando ? "Registrando..." : "Registrarse"}
                </button>
              </form>

              <div className="text-center my-3">
                <span className="text-muted small">O regístrate con</span>
              </div>

              <div className="d-flex justify-content-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() =>
                    setError("No fue posible registrarse con Google")
                  }
                  text="signup_with"
                  shape="rectangular"
                  width="280"
                />
              </div>

              <p className="text-center small mt-4 mb-0">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login">Inicia sesión</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Registro;
