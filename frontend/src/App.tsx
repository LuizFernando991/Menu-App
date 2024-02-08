import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.scss'
// contexts
import { AuthProvider } from './context/AuthContext'
// pages
import Login from './pages/Login'
import NavBar from './components/NavBar'
import CreateProduct from './pages/CreateProduct'
import EditProduct from './pages/EditProduct'

const App = () => {
  return (
    <Router>
      <Toaster containerStyle={{ fontSize: '1.6rem' }} />
      <AuthProvider>
        <div className="main-container">
          <NavBar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<CreateProduct />} />
            <Route path="/edit/:id" element={<EditProduct />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
