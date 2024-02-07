import { useLocalStorage } from './useLocalStorage'
import axios from 'axios'

export function useApi() {
  const { getTokenLocalStorage } = useLocalStorage()
  const token = getTokenLocalStorage()
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
  })

  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
  return api
}
