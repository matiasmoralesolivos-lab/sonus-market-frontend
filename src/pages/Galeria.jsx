
import { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "react-router-dom";

const categorias = [
  "Todas",
  "Audio profesional",
  "Instrumentos",
  "Accesorios",
  "Otros",
];

function Galeria() {
  const { publicaciones, cargarPublicaciones, cargandoPublicaciones } =
    useContext(GlobalContext);

  const [searchParams] = useSearchParams();

  const [categoria, setCategoria] = useState(
    searchParams.get("categoria") || "Todas"
  );
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarPublicaciones().catch((error) => {
      console.error("Error al cargar la galería:", error);
    });
  }, []);

  const publicacionesFiltradas = publicaciones.filter((producto) => {
    const coincideCategoria =
      categoria === "Todas" || producto.categoria === categoria;

    const coincideBusqueda = producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    return coincideCategoria && coincideBusqueda;
  });

  return (
    <>
      <Navbar />

      <main className="container gallery-container">
        <section className="gallery-hero">
          <div className="gallery-hero-content">
            <span className="gallery-eyebrow">EL MERCADO DEL SONIDO</span>
            <h1>Encuentra tu próximo sonido.</h1>
            <p>
              Explora instrumentos, equipos y accesorios.
              Conecta con otros apasionados de la música.
            </p>
          </div>

          <div className="gallery-orbit" aria-hidden="true">
            <span className="orbit-circle orbit-one"></span>
            <span className="orbit-circle orbit-two"></span>
            <span className="orbit-center">♫</span>
          </div>
        </section>

        <section className="gallery-catalog">
          <div className="gallery-toolbar">
            <div className="gallery-search">
              <span aria-hidden="true">⌕</span>
              <input
                type="text"
                placeholder="Buscar instrumentos, equipos, marcas..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                aria-label="Buscar publicaciones"
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda("")}
                  aria-label="Limpiar búsqueda"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="gallery-category-section">
            <span className="gallery-section-label">EXPLORAR POR CATEGORÍA</span>

            <div className="gallery-category-list">
              {categorias.map((nombre) => (
                <button
                  key={nombre}
                  type="button"
                  className={`gallery-category-chip ${
                    categoria === nombre ? "active" : ""
                  }`}
                  onClick={() => setCategoria(nombre)}
                >
                  {nombre}
                </button>
              ))}
            </div>
          </div>

          <div className="gallery-products-heading">
            <div>
              <span className="gallery-section-label">CATÁLOGO</span>
              <h2>Publicaciones disponibles</h2>
            </div>

            <span className="gallery-result-count">
              {cargandoPublicaciones
                ? "Cargando..."
                : `${publicacionesFiltradas.length} productos`}
            </span>
          </div>

          <div className="row g-4">
            {cargandoPublicaciones ? (
              <div className="col-12">
                <p className="text-secondary">Cargando publicaciones...</p>
              </div>
            ) : publicacionesFiltradas.length > 0 ? (
              publicacionesFiltradas.map((producto) => (
                <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={producto.id}>
                  <ProductCard producto={producto} />
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="gallery-empty">
                  <span>⌕</span>
                  <h3>No encontramos publicaciones</h3>
                  <p>
                    Prueba con otra búsqueda o selecciona una categoría diferente.
                  </p>
                  <button
                    type="button"
                    className="btn sonus-btn-primary mt-3"
                    onClick={() => {
                      setBusqueda("");
                      setCategoria("Todas");
                    }}
                  >
                    Ver todos los productos
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default Galeria;
