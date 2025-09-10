import { Link, useNavigate } from 'react-router-dom'
import './header.css'

const Header = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    // clear auth/session if you’re storing any
    localStorage.removeItem('authToken')

    // redirect to login page
    navigate('/')
  }

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <div className="nav-bar-large-container">
          {/* LEFT SIDE */}
          <div className="nav-left">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="profile"
              className="profile-icon"
            />
            <Link to="/home">
              <img
                className="website-logo"
                src="/vtalentlogo.png"
                alt="website logo"
              />
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="nav-right">
            <ul className="nav-menu">
              <li className="nav-menu-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-menu-item">
                <Link to="/quizes" className="nav-link">Quizes</Link>
              </li>
              <li className="nav-menu-item">
                <Link to="/history" className="nav-link">History</Link>
              </li>
            </ul>
            <button
              type="button"
              className="logout-desktop-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header
