import { Component } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

class Login extends Component {
  state = {
    email: "",
    password: "",
    adminId: "",
    userType: "student", // default
    showSubmitError: false,
    errorMsg: "",
    users: [
      { email: "student1@gmail.com", password: "pass123", userType: "student" },
      { email: "student2@gmail.com", password: "pass234", userType: "student" },
      {
        email: "prasad@gmail.com",
        password: "prasad1234",
        adminId: "ADM001",
        userType: "admin",
      },
      {
        email: "ramireddy@gmail.com",
        password: "ramireddy@1234",
        adminId: "ADM002",
        userType: "admin",
      },
    ],
  };

  componentDidMount() {
    // ✅ Load users from localStorage (merge with defaults)
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    this.setState((prevState) => ({
      users: [...prevState.users, ...storedUsers],
    }));
  }

  onChangeEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  onChangePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  onChangeAdminId = (event) => {
    this.setState({ adminId: event.target.value });
  };

  handleUserTypeClick = (type) => {
    this.setState({ userType: type, showSubmitError: false });
  };

  submitForm = (event) => {
    event.preventDefault();
    const { email, password, adminId, userType, users } = this.state;

    if (email === "" || password === "" || (userType === "admin" && adminId === "")) {
      this.setState({
        showSubmitError: true,
        errorMsg: "⚠️ Please fill all required fields",
      });
      return;
    }

    const matchedUser = users.find(
      (user) =>
        user.email === email &&
        user.password === password &&
        user.userType === userType &&
        (userType === "student" || (userType === "admin" && user.adminId === adminId))
    );

    if (matchedUser) {
      if (userType === "admin") {
        this.props.navigate("/admin");
      } else {
        this.props.navigate("/student");
      }
    } else {
      this.setState({
        showSubmitError: true,
        errorMsg: "Invalid credentials",
      });
    }
  };

  renderPasswordField = () => (
    <>
      <label className="input-label" htmlFor="password">
        PASSWORD
      </label>
      <input
        type="password"
        id="password"
        className="password-input-field"
        value={this.state.password}
        onChange={this.onChangePassword}
        placeholder="Enter Password"
      />
    </>
  );

  renderEmailField = () => (
    <>
      <label className="input-label" htmlFor="email">
        EMAIL
      </label>
      <input
        type="email"
        id="email"
        className="username-input-field"
        value={this.state.email}
        onChange={this.onChangeEmail}
        placeholder="Enter Email"
      />
    </>
  );

  renderAdminIdField = () => (
    <>
      <label className="input-label" htmlFor="adminId">
        ADMIN ID
      </label>
      <input
        type="text"
        id="adminId"
        className="username-input-field"
        value={this.state.adminId}
        onChange={this.onChangeAdminId}
        placeholder="Enter Admin ID"
      />
    </>
  );

  render() {
    const { showSubmitError, errorMsg, userType } = this.state;

    return (
      <div className="login-form-container">
        {/* ===== Left: Video ===== */}
        <div className="video-container">
          <video
            className="video"
            autoPlay
            loop
            muted
            playsInline
            src="/takequiz2.mp4"
            type="video/mp4"
          />
        </div>

        {/* ===== Right: Form ===== */}
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="/vtalentlogo.png"
            className="login-website-logo-desktop-img"
            alt="website logo"
          />

          {/* ===== Student/Admin Buttons ===== */}
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

          <div className="welcome">
            <h1>Welcome {userType === "admin" ? "Admin" : "Student"}</h1>
          </div>

          <div className="input-container">{this.renderEmailField()}</div>
          {userType === "admin" && (
            <div className="input-container">{this.renderAdminIdField()}</div>
          )}
          <div className="input-container">{this.renderPasswordField()}</div>

          <div className="forgot">
            <p
              className="forgot-text"
              onClick={() => this.setState({ showForgotPopup: true })}
            >
              Forgot Password?
            </p>
            <Link to="/register" className="register-link">
              Register
            </Link>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    );
  }
}

function LoginWithNavigate(props) {
  const navigate = useNavigate();
  return <Login {...props} navigate={navigate} />;
}

export default LoginWithNavigate;
