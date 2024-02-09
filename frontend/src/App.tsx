import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.scss'
// contexts
import { AuthProvider } from './context/AuthContext'
import ProtectedRoutes from './components/ProtectedRoutes'
// pages
import Login from './pages/Login'
import NavBar from './components/NavBar'
import CreateProduct from './pages/CreateProduct'
import EditProduct from './pages/EditProduct'
import Home from './pages/Home'
import Product from './pages/Product'

const App = () => {
  return (
    <Router>
      <Toaster containerStyle={{ fontSize: '1.6rem' }} />
      <AuthProvider>
        <div className="main-container">
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products/:id" element={<Product />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/create" element={<CreateProduct />} />
              <Route path="/edit/:id" element={<EditProduct />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
