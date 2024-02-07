import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.scss'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Oi</div>}></Route>
      </Routes>
    </Router>
  )
}

export default App
