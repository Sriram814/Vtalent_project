import { Component } from "react"
import { useNavigate } from "react-router-dom"
import "./signup.css"

class Signup extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    showPopup: false,
  }

  onChangeUsername = event => {
    this.setState({ username: event.target.value })
  }

  onChangeEmail = event => {
    this.setState({ email: event.target.value })
  }

  onChangePassword = event => {
    this.setState({ password: event.target.value })
  }

  submitForm = event => {
    event.preventDefault()
    const { username, email, password } = this.state

    if (username === "" || email === "" || password === "") {
      alert("⚠️ Please fill in all fields")
      return
    }

    console.log("✅ New User Registered:", { username, email, password })

    // Show popup after successful registration
    this.setState({ showPopup: true })
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
          placeholder="Enter Username"
        />
      </>
    )
  }

  renderEmailField = () => {
    const { email } = this.state
    return (
      <>
        <label className="input-label" htmlFor="email">
          EMAIL
        </label>
        <input
          type="email"
          id="email"
          className="username-input-field"
          value={email}
          onChange={this.onChangeEmail}
          placeholder="Enter Email"
        />
      </>
    )
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
          placeholder="Enter Password"
        />
      </>
    )
  }

  render() {
    const { showPopup } = this.state
    const { navigate } = this.props

    return (
      <div className="login-form-container">
        {/* Logo for mobile */}
        <img
          src="/vtalentlogo.png"
          className="login-website-logo-mobile-img"
          alt="website logo"
        />

        {/* Side illustration */}
        <img
          src="/welcomeimg1.jpg"
          className="login-img"
          alt="signup visual"
        />

        {/* Signup form */}
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="/vtalentlogo.png"
            className="login-website-logo-desktop-img"
            alt="website logo"
          />
          <div className="welcome">
            <h1>Create Your Account</h1>
          </div>

          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderEmailField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>

          <button type="submit" className="login-button">
            Create Account
          </button>
        </form>

        {/* Popup Message */}
        {showPopup && (
          <div className="popup-container">
            <div className="popup-box">
              <h3>🎉 Account Created Successfully!</h3>
              <button
                className="login-button"
                onClick={() => navigate("/")}
              >
                Go to Login Page
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

// ✅ Wrapper for navigation in class component
function SignupWithNavigate(props) {
  const navigate = useNavigate()
  return <Signup {...props} navigate={navigate} />
}

export default SignupWithNavigate
