import { createContext, useState, FC, PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from '../types/User'
import { useApi } from '../hooks/useApi'
import { useLocalStorage } from '../hooks/useLocalStorage'
import toast from 'react-hot-toast'

export type UserFormType = {
  email: string
  password: string
}

export type AuthProviderType = {
  singIn: (data: UserFormType) => Promise<void>
  user: User | null
  logout: () => void
  setUser: (user: User | null) => void
}

export const AuthContext = createContext({} as AuthProviderType)

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const {
    setUserLocalStorage,
    setTokenLocalStorage,
    removeTokenLocalStorage,
    removeUserLocalStorage,
    getUserLocalStorage
  } = useLocalStorage()
  const [user, setUser] = useState<User | null>(getUserLocalStorage())
  const navigate = useNavigate()

  const api = useApi()

  const singIn = async (userForm: UserFormType) => {
    try {
      const { data } = await api.post('/auth/login', userForm)
      setUserLocalStorage(data.user)
      setTokenLocalStorage(data.access_token)
      setUser(data.user)
      navigate('/')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error('Email ou senha inválida')
        return
      }
      toast.error('Algo deu errado, tente mais tarde')
    }
  }

  const logout = () => {
    removeTokenLocalStorage()
    removeUserLocalStorage()
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, singIn, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
