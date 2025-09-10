import { Component } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './login.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({ username: event.target.value })
  }

  onChangePassword = event => {
    this.setState({ password: event.target.value })
  }

  submitForm = event => {
    event.preventDefault()
    const { username, password } = this.state
    const { navigate } = this.props

    if (username === '' || password === '') {
      this.setState({
        showSubmitError: true,
        errorMsg: 'Please enter both fields',
      })
      return
    }

    // 🔹 Check for Admin credentials
    if (username === 'Prasad' && password === 'Prasad@123') {
      navigate('/admin')
    } else {
      // 🔹 Normal users → go to student page
      navigate('/student')
    }
  }

  renderPasswordField = () => {
    const { password } = this.state
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
      </>
    )
  }

  renderUsernameField = () => {
    const { username } = this.state
    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Username"
        />
      </>
    )
  }

  render() {
    const { showSubmitError, errorMsg } = this.state

    return (
      <div className="login-form-container">
        <img
          src="/vtalentlogo.png"
          className="login-website-logo-mobile-img"
          alt="website logo"
        />
        <img
          src="/quizimg1.png"
          className="login-img"
          alt="website login"
        />

        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="/vtalentlogo.png"
            className="login-website-logo-desktop-img"
            alt="website logo"
          />
          <div className="welcome">
            <h1>Welcome Buddy Please Login</h1>
          </div>

          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>

          {/* Forgot Password + Register Links */}
          <div className="forgot">
            <p className="forgot-text">Forgot Password?</p>
            <Link to="/register" className="register-link">
              Register
            </Link>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          {showSubmitError && (
            <p className="error-message">*{errorMsg}</p>
          )}
        </form>
      </div>
    )
  }
}

// ✅ wrapper to inject navigate into class component
function LoginWithNavigate(props) {
  const navigate = useNavigate()
  return <Login {...props} navigate={navigate} />
}

export default LoginWithNavigate
