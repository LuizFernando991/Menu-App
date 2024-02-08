import { FC, useEffect, useState } from 'react'
import ProductForm from '../../components/ProductForm'
import { useApi } from '../../hooks/useApi'
import './editproduct.styles.scss'
import toast from 'react-hot-toast'
import { ProductFormType, ProductType } from '../../types/Prodcut'
import { useNavigate, useParams } from 'react-router-dom'

const EditProduct: FC = () => {
  const [product, setProduct] = useState<null | ProductType>(null)
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

  const onSubmit = async (data: ProductFormType) => {
    if (!data.categoryIds?.length) {
      toast.error('Selecione ao menos uma categoria para seu item!')
      return
    }
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        if (key === 'photo' && value instanceof File) {
          formData.append(key, value)
        } else if (typeof value === 'string') {
          formData.append(key, value)
        } else {
          formData.append(key, JSON.stringify(value))
        }
      }
    })
    try {
      await api.patch(`/product/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success('Item salvo!')
      navigate('/')
    } catch (err) {
      toast.error('Algo deu errado, tente mais tarde!')
    }
  }
  return (
    <main className="edit-product-container">
      <h1>Editando: {product?.name}</h1>
      {product && (
        <ProductForm onSubmit={onSubmit} product={product || undefined} />
      )}
    </main>
  )
}

export default EditProduct
