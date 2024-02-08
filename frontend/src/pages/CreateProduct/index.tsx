import { FC } from 'react'
import ProductForm from '../../components/ProductForm'
import { useApi } from '../../hooks/useApi'
import './createproduct.styles.scss'
import toast from 'react-hot-toast'
import { ProductFormType } from '../../types/Prodcut'
import { useNavigate } from 'react-router-dom'

const CreateProduct: FC = () => {
  const api = useApi()
  const navigate = useNavigate()
  const onSubmit = async (data: ProductFormType) => {
    if (!data.categoryIds?.length) {
      toast.error('Selecione ao menos uma categoria para seu item!')
      return
    }
    if (!data.photo) {
      toast.error('Selecione uma foto para seu produto!')
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
      await api.post('/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success('Item criado!')
      navigate('/')
    } catch (err) {
      toast.error('Algo deu errado, tente mais tarde!')
    }
  }
  return (
    <main className="create-product-container">
      <h1>Adicione um novo item ao seu cardápio!</h1>
      <ProductForm onSubmit={onSubmit} />
    </main>
  )
}

export default CreateProduct
