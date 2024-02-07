import { User } from '../types/User'

export const useLocalStorage = () => {
  const setUserLocalStorage = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user))
  }

  const getUserLocalStorage = (): User | null => {
    const json = localStorage.getItem('user')
    if (!json) {
      return null
    }
    const user = JSON.parse(json)
    return user ?? null
  }

  const setTokenLocalStorage = (token: string) => {
    localStorage.setItem('token', JSON.stringify(token))
  }

  const getTokenLocalStorage = (): string | null => {
    const json = localStorage.getItem('token')
    if (!json) {
      return null
    }
    const token = JSON.parse(json)
    return token
  }

  const removeUserLocalStorage = () => {
    localStorage.removeItem('user')
  }

  const removeTokenLocalStorage = () => {
    localStorage.removeItem('token')
  }

  return {
    setUserLocalStorage,
    setTokenLocalStorage,
    getUserLocalStorage,
    getTokenLocalStorage,
    removeUserLocalStorage,
    removeTokenLocalStorage
  }
}
