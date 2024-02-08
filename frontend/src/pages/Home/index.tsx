import { FC, useEffect, useState } from 'react'
import banner from '../../assents/banner.png'
import SearchInput from '../../components/SearchInput'
import { useApi } from '../../hooks/useApi'
import { Category } from '../../types/Category'
import Select from 'react-select'
import transformCategories from '../../helpers/tranformSelectOptions'
import './home.styles.scss'

type SelectOptionsType = {
  value: number
  label: string
}

const Home: FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<
    SelectOptionsType[]
  >([])

  const api = useApi()
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.get('/category')
        setCategories(data)
      } catch (err) {
        //
      }
    })()
  }, [])

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
            <SearchInput value="string" setValue={() => {}} />
          </div>
        </div>
      </header>
    </main>
  )
}

export default Home
