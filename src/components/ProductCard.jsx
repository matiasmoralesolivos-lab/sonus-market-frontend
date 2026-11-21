
import { Link } from 'react-router-dom'

function ProductCard({ producto }) {
  return (
    <div className="card product-card h-100">
      <Link
        to={`/publicaciones/${producto.id}`}
        className="product-image-container"
      >
        {producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="product-image"
          />
        ) : (
          <span className="text-secondary small">IMAGEN NO DISPONIBLE</span>
        )}
      </Link>

      <div className="card-body product-card-body">
        <h5 className="card-title product-title">
          {producto.nombre}
        </h5>

        <p className="product-price">
          ${Number(producto.precio).toLocaleString('es-CL')}
        </p>

        <Link
          to={`/publicaciones/${producto.id}`}
          className="btn btn-outline-secondary btn-sm w-100"
        >
          Ver publicación
        </Link>
      </div>
    </div>
  )
}

export default ProductCard
