import { FC, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ProductType } from '../../types/Prodcut'
import { useApi } from '../../hooks/useApi'
import { MdDelete, MdEdit } from 'react-icons/md'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import toast from 'react-hot-toast'

import './product.styles.scss'
import useAuth from '../../hooks/useAuth'

const Product: FC = () => {
  const { user } = useAuth()
  const [product, setProduct] = useState<null | ProductType>(null)
  const [deleting, setDeleting] = useState(false)
  const api = useApi()
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/product/${id}`)
        setProduct(data)
      } catch (err) {
        toast.error('Item não encontrado')
        navigate('/')
      }
    }
    fetchProduct()
  }, [])

  const deleteItem = async () => {
    setDeleting(false)
    try {
      await api.delete(`/product/${id}`)
      toast.success('Item deletado!')
      navigate('/')
    } catch (err) {
      toast.error('Algo deu errado, tente mais tarde!')
    } finally {
      setDeleting(true)
    }
  }

  return (
    <main className="product-container">
      <div className="image-preview-container ">
        <img
          src={`${process.env.REACT_APP_API_PUBLIC_FOLDER_URL}${product?.photo}`}
          alt="product-image"
        />
      </div>
      <div className="info-container">
        <h1>{product?.name}</h1>
        <p>R$: {product?.price}</p>

        <div className="categories-info-container">
          {product?.categories.map((cat) => (
            <span key={cat.id}>{cat.name}</span>
          ))}
        </div>
        {!!user && (
          <div className="actions-container">
            <button className="icon" onClick={deleteItem}>
              {!deleting ? (
                <MdDelete className="icon" />
              ) : (
                <AiOutlineLoading3Quarters className="icon animated-icon" />
              )}
            </button>
            <Link to={`/edit/${id}`}>
              <MdEdit className="icon" />
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

export default Product
