import { FC, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Cropper, { ReactCropperElement } from 'react-cropper'
import Input from '../Input'
import Select from 'react-select'
import { IoCloudUploadOutline } from 'react-icons/io5'
import './productform.styles.scss'
import 'cropperjs/dist/cropper.css'
import { useApi } from '../../hooks/useApi'
import { Category } from '../../types/Category'
import transformCategories from '../../helpers/tranformSelectOptions'
import { ProductFormType } from '../../types/Prodcut'
import toast from 'react-hot-toast'

type ProductFormProps = {
  product?: {
    name: string
    price: number
    qty: number
    categories?: Category[]
    photo?: string
  }
  onSubmit: (data: ProductFormType) => Promise<void>
}

type SelectOptionsType = {
  value: number
  label: string
}

const ProductForm: FC<ProductFormProps> = ({ product, onSubmit }) => {
  const [uploadedImage, setUploadedImage] = useState<string | undefined>()
  const [croppedImage, setCroppedImage] = useState<string | undefined>()
  const [loading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<
    SelectOptionsType[]
  >(transformCategories(product?.categories || []))
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: product?.name ? product.name : '',
      qty: product?.qty ? product.qty : 1,
      price: product?.price
        ? product.price.toString().replace('.', ',')
        : '1,00'
    }
  })
  const api = useApi()
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.get('/category')
        setCategories(data)
      } catch (err) {
        // console.log(err)
      }
    })()
  }, [])

  const cropperRef = useRef<ReactCropperElement>(null)
  const getUploadedImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCroppedImage(undefined)
    if (e.target.files?.length) {
      setUploadedImage(URL.createObjectURL(e.target.files[0]))
    }
  }
  const saveCroppedImage = () => {
    const cropper = cropperRef?.current?.cropper
    if (cropper) {
      const croppedImageUrl = cropper.getCroppedCanvas().toDataURL()
      setUploadedImage(croppedImageUrl)
      setCroppedImage(croppedImageUrl)
    }
  }

  const onFormSubmit = async (data: {
    name: string
    qty: number
    price: string
    photo?: File | null
  }) => {
    setIsLoading(true)
    const formattedPrice: number | string = Number(data.price.replace(',', '.'))
    if (isNaN(formattedPrice)) {
      toast.error('Valor inválido!')
      return
    }
    const cropperInstance = cropperRef?.current?.cropper
    if (cropperInstance) {
      cropperInstance.getCroppedCanvas().toBlob(async (blob) => {
        if (blob) {
          data.photo = new File([blob], 'photo.jpg', { type: 'image/jpg' })
        }
        await onSubmit({
          ...data,
          qty: Number(data.qty),
          price: formattedPrice,
          categoryIds: selectedCategories.map((cat) => cat.value)
        })
        setIsLoading(false)
      })
    } else {
      await onSubmit({
        ...data,
        qty: Number(data.qty),
        price: formattedPrice,
        categoryIds: selectedCategories.map((cat) => cat.value)
      })
      setIsLoading(false)
    }
  }

  const categoriesOptions: SelectOptionsType[] = transformCategories(categories)

  return (
    <form className="form" onSubmit={handleSubmit(onFormSubmit)}>
      <label className="image-container" htmlFor="image">
        {croppedImage || product?.photo ? (
          <img
            src={
              croppedImage
                ? croppedImage
                : product?.photo
                  ? `${process.env.REACT_APP_API_PUBLIC_FOLDER_URL}${product?.photo}`
                  : ''
            }
          />
        ) : (
          <>
            <IoCloudUploadOutline className="upload-icon" />
            <p>Adicione uma imagem do produto!</p>
          </>
        )}
        <input
          className="image-input"
          type="file"
          id="image"
          onChange={getUploadedImage}
          accept="image/jpeg"
        />
      </label>
      {uploadedImage && !croppedImage && (
        <div className="cropped-modal-container">
          <div className="cropped-modal">
            <div className="cropped-container">
              <Cropper
                style={{ height: '100%', width: '100%' }}
                src={uploadedImage}
                guides={false}
                initialAspectRatio={1}
                aspectRatio={1}
                viewMode={1}
                ref={cropperRef}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={true}
                responsive={true}
                preview=".img-preview"
              />
            </div>
            <button
              onClick={saveCroppedImage}
              type="button"
              className="save-button"
            >
              Salvar
            </button>
          </div>
        </div>
      )}
      <Input
        register={register}
        name="name"
        placeholder="Nome do item"
        error={errors['name']?.message}
      />
      <div className="number-inputs-container">
        <Input
          register={register}
          name="qty"
          placeholder="Quantidade"
          type="number"
          error={errors['qty']?.message}
        />
        <Input
          register={register}
          name="price"
          placeholder="Quanto custa o item? (R$)"
          error={errors['price']?.message}
        />
      </div>
      <Select
        options={categoriesOptions}
        isMulti
        name="categories"
        className="basic-multi-select multi-input-select"
        classNamePrefix="select"
        onChange={(e) => setSelectedCategories(e.map((i) => i))}
        value={selectedCategories}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary25: 'grey',
            primary: 'red'
          }
        })}
      />
      <button disabled={loading} className="save-button">
        Salvar
      </button>
    </form>
  )
}

export default ProductForm
