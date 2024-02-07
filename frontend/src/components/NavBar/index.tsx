import { FC } from 'react'
import logo from '../../assents/logo.png'
import useAuth from '../../hooks/useAuth'
import { IoIosExit } from 'react-icons/io'
import { Link } from 'react-router-dom'

import './navbar.styles.scss'

const NavBar: FC = () => {
  const { user, logout } = useAuth()
  return (
    <nav className="nav-container">
      <a href="/">
        <img src={logo} alt="Logo" />
      </a>
      {user ? (
        <div className="exit-menu">
          <span>Olá administrador! Deseja sair?</span>
          <IoIosExit className="exit-icon" onClick={logout} />
        </div>
      ) : (
        <div className="login-menu">
          É um administrador desse cardápio?{' '}
          <Link className="link" to="/login">
            Entrar
          </Link>
        </div>
      )}
    </nav>
  )
}

export default NavBar
