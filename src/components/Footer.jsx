
import { Link } from 'react-router-dom'
import './Footer.css'

const categorias = [
  'Audio profesional',
  'Instrumentos',
  'Accesorios',
  'Otros',
]

function LogoSonus() {
  return (
    <span className="brand-icon">
      <svg
        viewBox="0 0 40 40"
        width="27"
        height="27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <ellipse
          cx="20"
          cy="20"
          rx="16"
          ry="8"
          transform="rotate(-35 20 20)"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity=".7"
        />
        <path
          d="M8 21h4l3-7 5 13 4-10 3 4h5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="20" r="2.5" fill="currentColor" />
      </svg>
    </span>
  )
}

function Footer() {
  return (
    <footer className="sonus-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-md-5">
            <Link to="/" className="footer-brand">
              <LogoSonus />
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
                  <Link to={`/publicaciones?categoria=${encodeURIComponent(categoria)}`}>
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
