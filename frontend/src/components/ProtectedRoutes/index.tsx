import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const ProtectedRoutes = () => {
  const { user } = useAuth()

  return user ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoutes
