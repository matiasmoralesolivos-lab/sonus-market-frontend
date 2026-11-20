
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GlobalContext } from '../context/GlobalContext'

function Navbar() {
  const { usuario, cerrarSesion } = useContext(GlobalContext)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    cerrarSesion()
    setMenuAbierto(false)
    navigate('/')
  }

  const cerrarMenu = () => {
    setMenuAbierto(false)
  }

  return (
    <nav className="navbar navbar-expand-lg sonus-navbar">
      <div className="container">

        <Link
          className="navbar-brand sonus-brand"
          to="/"
          onClick={cerrarMenu}
        >
          <span className="brand-icon">S</span>
          SonusMarket
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-expanded={menuAbierto}
          aria-label="Abrir menú de navegación"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuAbierto ? 'show' : ''}`}>
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-3">

            <Link
              className="nav-link sonus-nav-link"
              to="/"
              onClick={cerrarMenu}
            >
              Inicio
            </Link>

            <Link
              className="nav-link sonus-nav-link"
              to="/publicaciones"
              onClick={cerrarMenu}
            >
              Explorar
            </Link>

            {usuario ? (
              <>
                <Link
                  className="nav-link sonus-nav-link"
                  to="/perfil"
                  onClick={cerrarMenu}
                >
                  Mi perfil
                </Link>

                <span className="navbar-text sonus-user-name">
                  Hola, {usuario.nombre}
                </span>

                <button
                  className="btn sonus-btn-outline btn-sm"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  className="nav-link sonus-nav-link"
                  to="/login"
                  onClick={cerrarMenu}
                >
                  Iniciar sesión
                </Link>

                <Link
                  className="btn sonus-btn-primary btn-sm"
                  to="/registro"
                  onClick={cerrarMenu}
                >
                  Registrarse
                </Link>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
