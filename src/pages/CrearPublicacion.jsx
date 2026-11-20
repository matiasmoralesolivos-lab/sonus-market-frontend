import { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import { obtenerPublicacionAPI, obtenerEtiquetasAPI } from "../services/api";
import Navbar from "../components/Navbar";

function CrearPublicacion() {
  const { usuario, token, agregarPublicacion, editarPublicacion } =
    useContext(GlobalContext);

  const navigate = useNavigate();
  const { id } = useParams();

  const modoEdicion = Boolean(id);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("Instrumentos");
  const [stock, setStock] = useState("1");
  const [imagenUrl, setImagenUrl] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(modoEdicion);
  const [etiquetas, setEtiquetas] = useState([]);
  const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState([]);
  const [cargandoEtiquetas, setCargandoEtiquetas] = useState(true);

  // Cargar catálogo de etiquetas
  useEffect(() => {
    const cargarEtiquetas = async () => {
      try {
        const datos = await obtenerEtiquetasAPI();
        setEtiquetas(datos);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargandoEtiquetas(false);
      }
    };

    cargarEtiquetas();
  }, []);

  // Cargar datos de la publicación cuando estamos editando
  useEffect(() => {
    if (!modoEdicion || !usuario || !token) return;

    const cargarDatos = async () => {
      try {
        const publicacion = await obtenerPublicacionAPI(id);

        if (Number(publicacion.usuario_id) !== Number(usuario.id)) {
          setError("No tienes permiso para editar esta publicación.");
          return;
        }

        setNombre(publicacion.nombre);
        setDescripcion(publicacion.descripcion);
        setPrecio(String(publicacion.precio));
        setCategoria(publicacion.categoria);
        setStock(String(publicacion.stock));
        setImagenUrl(publicacion.imagen_url || "");
        setEtiquetasSeleccionadas(
          (publicacion.etiquetas || []).map((etiqueta) => Number(etiqueta.id)),
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id, modoEdicion, usuario, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setGuardando(true);

    try {
      const datosPublicacion = {
        nombre,
        descripcion,
        precio: Number(precio),
        categoria,
        stock: Number(stock),
        imagen_url: imagenUrl,
        etiquetas: etiquetasSeleccionadas,
      };

      if (modoEdicion) {
        await editarPublicacion(id, datosPublicacion);
        alert("Publicación actualizada correctamente.");
      } else {
        await agregarPublicacion(datosPublicacion);
        alert("Publicación creada correctamente.");
      }

      navigate("/perfil");
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  };

  if (!usuario) {
    return (
      <>
        <Navbar />
        <main className="container py-5">
          <h1 className="h4">
            Debes iniciar sesión para {modoEdicion ? "editar" : "crear"} una
            publicación.
          </h1>
          <Link to="/login" className="btn btn-dark mt-3">
            Iniciar sesión
          </Link>
        </main>
      </>
    );
  }

  if (cargando) {
    return (
      <>
        <Navbar />
        <main className="container py-5">
          <p>Cargando publicación...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="container py-5">
        <h1 className="h3 mb-4">
          {modoEdicion ? "Editar publicación" : "Crear publicación"}
        </h1>

        <div className="row g-5">
          <div className="col-12 col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre del producto</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Precio</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Categoría</label>
                <select
                  className="form-select"
                  value={categoria}
                  onChange={(e) => {
                    const nuevaCategoria = e.target.value;

                    setCategoria(nuevaCategoria);

                    setEtiquetasSeleccionadas((seleccionadas) =>
                      seleccionadas.filter((id) =>
                        etiquetas.some(
                          (etiqueta) =>
                            etiqueta.id === id &&
                            etiqueta.categoria === nuevaCategoria,
                        ),
                      ),
                    );
                  }}
                >
                  <option value="Audio profesional">Audio profesional</option>
                  <option value="Instrumentos">Instrumentos</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Etiquetas</label>

                {cargandoEtiquetas ? (
                  <p className="text-secondary small">Cargando etiquetas...</p>
                ) : (
                  <div className="border rounded-3 p-3">
                    {etiquetas
                      .filter((etiqueta) => etiqueta.categoria === categoria)
                      .map((etiqueta) => (
                        <div className="form-check" key={etiqueta.id}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`etiqueta-${etiqueta.id}`}
                            checked={etiquetasSeleccionadas.includes(
                              etiqueta.id,
                            )}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEtiquetasSeleccionadas([
                                  ...etiquetasSeleccionadas,
                                  etiqueta.id,
                                ]);
                              } else {
                                setEtiquetasSeleccionadas(
                                  etiquetasSeleccionadas.filter(
                                    (id) => id !== etiqueta.id,
                                  ),
                                );
                              }
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`etiqueta-${etiqueta.id}`}
                          >
                            {etiqueta.nombre}
                          </label>
                        </div>
                      ))}

                    {!etiquetas.some(
                      (etiqueta) => etiqueta.categoria === categoria,
                    ) && (
                      <p className="text-secondary small mb-0">
                        No hay etiquetas disponibles para esta categoría.
                      </p>
                    )}
                  </div>
                )}
                <small className="text-secondary">
                  Puedes seleccionar varias etiquetas.
                </small>
              </div>

              <div className="mb-3">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">URL de imagen</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={imagenUrl}
                  onChange={(e) => setImagenUrl(e.target.value)}
                  required
                />
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <button
                type="submit"
                className="btn btn-dark"
                disabled={guardando}
              >
                {guardando
                  ? "Guardando..."
                  : modoEdicion
                    ? "Guardar cambios"
                    : "Publicar producto"}
              </button>
            </form>
          </div>

          <div className="col-12 col-md-6">
            <h2 className="h5 mb-3">Vista previa de imagen</h2>

            <div
              className="bg-light border rounded-4 d-flex align-items-center justify-content-center"
              style={{ minHeight: "350px" }}
            >
              {imagenUrl ? (
                <img
                  src={imagenUrl}
                  alt="Vista previa del producto"
                  className="img-fluid rounded-4"
                  style={{ maxHeight: "350px" }}
                />
              ) : (
                <span className="text-secondary">IMAGEN</span>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default CrearPublicacion;
