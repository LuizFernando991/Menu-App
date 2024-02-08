import { FC } from 'react'
import { ProductType } from '../../types/Prodcut'
import { Link } from 'react-router-dom'
import './productcard.styles.scss'

type ProductCardPropsType = {
  product: ProductType
  isAdmin?: boolean
}

const ProductCard: FC<ProductCardPropsType> = ({ product }) => {
  return (
    <li className="product-card-container">
      <img
        src={`${process.env.REACT_APP_API_PUBLIC_FOLDER_URL}${product.photo}`}
        alt={product.name}
      />
      <div className="side-information">
        <h3>{product.name}</h3>
        <p>R$: {product.price.toFixed(2).toString().replace('.', ',')}</p>
        <Link to={`/products/${product.id}`}>Detalhes</Link>
      </div>
    </li>
  )
}

export default ProductCard
