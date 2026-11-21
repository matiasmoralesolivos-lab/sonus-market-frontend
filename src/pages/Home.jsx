import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import "./Home.css";
import Footer from "../components/Footer";

const categorias = [
  {
    nombre: "Audio profesional",
    descripcion: "Monitores y amplificación",
  },
  {
    nombre: "Instrumentos",
    descripcion: "Guitarras, bajos y teclados",
  },
  {
    nombre: "Accesorios",
    descripcion: "Cables, atriles y otros",
  },
  {
    nombre: "Otros",
    descripcion: "Productos variados",
  },
];

function Home() {
  const { publicaciones, cargarPublicaciones, cargandoPublicaciones } =
    useContext(GlobalContext);

  useEffect(() => {
    cargarPublicaciones().catch((error) => {
      console.error("Error al cargar publicaciones recientes:", error);
    });
  }, []);

const publicacionesRecientes = [...publicaciones]
  .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
  .slice(0, 6);

  return (
    <>
      <Navbar />

      <main className="container home-container">
        <section className="home-hero">
          <h1>Audio profesional y música</h1>

          <p>Encuentra equipos, accesorios e instrumentos musicales.</p>

          <Link to="/publicaciones" className="btn btn-outline-dark btn-sm">
            Explorar productos
          </Link>
        </section>

        <section className="home-categories">
          <h2>Categorías destacadas</h2>

          <div className="row g-3">
            {categorias.map((categoria) => (
              <div className="col-6 col-lg-3" key={categoria.nombre}>
                <Link
                  to={`/publicaciones?categoria=${encodeURIComponent(categoria.nombre)}`}
                  className="category-card"
                >
                  <h3>{categoria.nombre}</h3>
                  <p>{categoria.descripcion}</p>
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="home-products">
          <h2>Publicaciones recientes</h2>

          {cargandoPublicaciones ? (
            <p className="text-secondary">Cargando publicaciones...</p>
          ) : (
            <div className="row g-4">
              {publicacionesRecientes.map((producto) => (
                <div className="col-12 col-md-6 col-lg-4" key={producto.id}>
                  <ProductCard producto={producto} />
                </div>
              ))}

              {publicacionesRecientes.length === 0 && (
                <p className="text-secondary">
                  Todavía no hay publicaciones disponibles.
                </p>
              )}
            </div>




          )}

<div className="text-center mt-4">
  <Link to="/publicaciones" className="btn btn-outline-dark">
    Ver todas las publicaciones
  </Link>
</div>

        </section>
      </main>
      <Footer />
    </>
  );
}

export default Home;
