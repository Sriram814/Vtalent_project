import { Component } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

class Signup extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    adminId: "",
    userType: "student", // default student
    errorMsg: "",
    showSubmitError: false,
    showPopup: false,
  };

  onChangeUsername = (event) => this.setState({ username: event.target.value });
  onChangeEmail = (event) => this.setState({ email: event.target.value });
  onChangePassword = (event) => this.setState({ password: event.target.value });
  onChangeAdminId = (event) => this.setState({ adminId: event.target.value });

  handleUserTypeClick = (type) => {
    this.setState({ userType: type });
  };

  submitForm = (event) => {
    event.preventDefault();
    const { username, email, password, adminId, userType } = this.state;

    if (
      username === "" ||
      email === "" ||
      password === "" ||
      (userType === "admin" && adminId === "")
    ) {
      this.setState({
        showSubmitError: true,
        errorMsg: "⚠️ Please fill in all required fields",
      });
      return;
    }

    // ✅ Retrieve old users
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // ✅ Create new user
    const newUser = { username, email, password, userType };
    if (userType === "admin") {
      newUser.adminId = adminId;
    }

    // ✅ Save to localStorage
    storedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(storedUsers));

    // ✅ Show success popup
    this.setState({ showPopup: true, showSubmitError: false });
  };

  render() {
    const { userType, showSubmitError, errorMsg, showPopup } = this.state;
    const { navigate } = this.props;

    return (
      <div className="login-form-container">
        {/* ===== Left Side Image ===== */}
        <div className="video-container">
          <video
            className="video"
            autoPlay
            loop
            muted
            playsInline
            src="/signupvid.mp4"
            type="video/mp4"
          />
        </div>

        {/* ===== Signup Form ===== */}
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="/Corpitsoftlogo.png"
            className="login-website-logo-desktop-img"
            alt="website logo"
          />

          <div className="welcome">
            <h1>Create Your Account</h1>
          </div>

          {/* ===== Student/Admin Toggle ===== */}
          <div className="login-type-buttons">
            <button
              type="button"
              className={`login-type-btn ${userType === "student" ? "active" : ""}`}
              onClick={() => this.handleUserTypeClick("student")}
            >
              Student
            </button>
            <button
              type="button"
              className={`login-type-btn ${userType === "admin" ? "active" : ""}`}
              onClick={() => this.handleUserTypeClick("admin")}
            >
              Admin
            </button>
          </div>

          {/* ===== Username ===== */}
          <div className="input-container">
            <label className="input-label" htmlFor="username">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              className="username-input-field"
              onChange={this.onChangeUsername}
              placeholder="Enter Username"
            />
          </div>

          {/* ===== Email ===== */}
          <div className="input-container">
            <label className="input-label" htmlFor="email">
              EMAIL
            </label>
            <input
              type="email"
              id="email"
              className="username-input-field"
              onChange={this.onChangeEmail}
              placeholder="Enter Email"
            />
          </div>

          {/* ===== Admin ID (only if Admin) ===== */}
          {userType === "admin" && (
            <div className="input-container">
              <label className="input-label" htmlFor="adminId">
                ADMIN ID
              </label>
              <input
                type="text"
                id="adminId"
                className="username-input-field"
                onChange={this.onChangeAdminId}
                placeholder="Enter Admin ID"
              />
            </div>
          )}

          {/* ===== Password ===== */}
          <div className="input-container">
            <label className="input-label" htmlFor="password">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              className="password-input-field"
              onChange={this.onChangePassword}
              placeholder="Enter Password"
            />
          </div>

          {/* ===== Buttons ===== */}
          <div className="login-type-buttons">
            <button type="submit" className={`login-type-btn ${userType === "student" ? "active" : ""}`}>
              Create Account
            </button>
            <button
              type="button"
              className={`login-type-btn ${userType === "student" ? "active" : ""}`}
              onClick={() => this.props.navigate("/")}
            >
              Back
            </button>
          </div>

          {/* ===== Error Message ===== */}
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>

        {/* ===== Success Popup ===== */}
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
    );
  }
}

function SignupWithNavigate(props) {
  const navigate = useNavigate();
  return <Signup {...props} navigate={navigate} />;
}

export default SignupWithNavigate;
