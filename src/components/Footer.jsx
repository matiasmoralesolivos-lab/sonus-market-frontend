
import { Link } from 'react-router-dom'
import './Footer.css'

const categorias = [
  'Audio profesional',
  'Instrumentos',
  'Accesorios',
  'Otros',
]

function Footer() {
  return (
    <footer className="sonus-footer">
      <div className="container">
        <div className="row g-4">

          <div className="col-12 col-md-5">
            <Link to="/" className="footer-brand">
              <span className="brand-icon">S</span>
              SonusMarket
            </Link>

            <p className="footer-description">
              Marketplace especializado en la compra y venta de
              instrumentos musicales y equipos de sonido.
            </p>
          </div>

          <div className="col-6 col-md-3">
            <h3 className="footer-title">Navegación</h3>
            <ul className="footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/publicaciones">Explorar</Link></li>
              <li><Link to="/login">Iniciar sesión</Link></li>
              <li><Link to="/registro">Registrarse</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-4">
            <h3 className="footer-title">Categorías</h3>
            <ul className="footer-links">
              {categorias.map((categoria) => (
                <li key={categoria}>
                  <Link
                    to={`/publicaciones?categoria=${encodeURIComponent(categoria)}`}
                  >
                    {categoria}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} SonusMarket. Todos los derechos reservados.</p>
          <p>Un espacio para quienes viven la música.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
