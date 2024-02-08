import { FC, useEffect, useState } from 'react'
import banner from '../../assents/banner.png'
import SearchInput from '../../components/SearchInput'
import { useApi } from '../../hooks/useApi'
import { Category } from '../../types/Category'
import {
  useLocation,
  useNavigate,
  createSearchParams,
  Link
} from 'react-router-dom'
import Select from 'react-select'
import transformCategories from '../../helpers/tranformSelectOptions'
import { ProductType } from '../../types/Prodcut'
import { useDebounce } from '../../hooks/useDebounce'
import Pagination from '../../components/Pagination'
import ProductCard from '../../components/ProductCard'
import { IoCreateOutline } from 'react-icons/io5'
import useAuth from '../../hooks/useAuth'
import './home.styles.scss'

type SelectOptionsType = {
  value: number
  label: string
}

const Home: FC = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const searchQuery = queryParams.get('search')
  const pageQuery = queryParams.get('page')
  const categoriesQuery = queryParams.get('categories')
  const navigate = useNavigate()
  const [search, setSearch] = useState(searchQuery || '')
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState<ProductType[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<
    SelectOptionsType[]
  >([])
  const debouncedSearch = useDebounce(search, 300)
  const api = useApi()
  const { user } = useAuth()
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.get('/category')
        setCategories(data)
        if (categoriesQuery) {
          const filterCat = data.filter((e: Category) =>
            categoriesQuery.split('or').includes(e.id.toString())
          )
          setSelectedCategories(transformCategories(filterCat))
        }
      } catch (err) {
        //
      }
    })()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/product', {
          params: {
            search: searchQuery || '',
            page: pageQuery || '',
            categories: categoriesQuery?.replace('or', ',') || ''
          }
        })
        setProducts(data.data)
        setTotalPages(data.totalPages)
      } catch (err) {
        //
      }
    }

    fetchProducts()
  }, [pageQuery, searchQuery, categoriesQuery])

  useEffect(() => {
    let query = {}
    if (debouncedSearch) {
      query = {
        search: debouncedSearch.toString()
      }
    }
    if (currentPage !== 1) {
      query = {
        ...query,
        page: currentPage
      }
    }
    if (selectedCategories.length) {
      query = {
        ...query,
        categories: selectedCategories
          .map((cat) => cat.value.toString())
          .join('or')
      }
    }
    navigate({
      pathname: '/',
      search: `?${createSearchParams(query)}`
    })
  }, [debouncedSearch, selectedCategories, currentPage])

  const categoriesOptions: SelectOptionsType[] = transformCategories(categories)

  return (
    <main className="main-container">
      <header className="header-container">
        <img src={banner} alt="banner" />
        <h1>Bem vindo! Confira nosso cardápio:</h1>
        <div className="seach-options-container">
          <Select
            options={categoriesOptions}
            isMulti
            name="categories"
            placeholder="Filtre por categorias!"
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
          <div className="search-input-container">
            <SearchInput
              value={search}
              setValue={(e) => {
                if (currentPage !== 1) {
                  setCurrentPage(1)
                }
                setSearch(e)
              }}
            />
          </div>
        </div>
      </header>
      {!!user && (
        <Link className="create-button" to="/create">
          Criar Item <IoCreateOutline />
        </Link>
      )}
      <div className="products-container">
        <ul className="product-listing">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </ul>
      </div>
      <Pagination
        onPageChange={(e) => {
          setCurrentPage(e)
        }}
        totalCount={totalPages}
        currentPage={currentPage}
      />
    </main>
  )
}

export default Home
