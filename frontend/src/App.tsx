import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.scss'

// pages
import Login from './pages/Login'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </Router>
  )
}

export default App
