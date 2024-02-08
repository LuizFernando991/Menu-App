import { Category } from '../types/Category'

const transformCategories = (categories: Category[]) => {
  return categories.map((cat) => {
    return {
      value: cat.id,
      label: cat.name
    }
  })
}

export default transformCategories
