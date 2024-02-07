import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.scss'
// contexts
import { AuthProvider } from './context/AuthContext'
// pages
import Login from './pages/Login'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <Router>
      <Toaster containerStyle={{ fontSize: '1.6rem' }} />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
