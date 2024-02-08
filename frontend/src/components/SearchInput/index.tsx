import { FC } from 'react'

import './searchinput.styles.scss'

type SearchInputPropsType = {
  value: string
  setValue: (search: string) => void
}

const SearchInput: FC<SearchInputPropsType> = ({ value, setValue }) => {
  return (
    <div className="form__group field">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        id="search"
        className="form__field"
        placeholder={'Pesquise seu prato favorito!'}
      />
      <label htmlFor="search" className="form__label">
        Pesquise seu prato favorito!
      </label>
    </div>
  )
}

export default SearchInput
