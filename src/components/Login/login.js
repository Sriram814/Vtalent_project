import { Component } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

class Login extends Component {
  state = {
    email: "",
    password: "",
    adminId: "",
    userType: "student",
    showSubmitError: false,
    errorMsg: "",
    showForgotPopup: false,
    forgotEmail: "",
    forgotAdminId: "",
    forgotResult: "",
    users: [
      { email: "student1@gmail.com", password: "pass123", userType: "student" },
      { email: "student2@gmail.com", password: "pass234", userType: "student" },
      { email: "prasad@gmail.com", password: "prasad@1234", adminId: "ADM001", userType: "admin" },
      { email: "ramireddy@gmail.com", password: "ramireddy@1234", adminId: "ADM002", userType: "admin" },
    ],
  };

  componentDidMount() {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    this.setState((prevState) => ({
      users: [...prevState.users, ...storedUsers],
    }));
  }

  onChangeEmail = (event) => this.setState({ email: event.target.value });
  onChangePassword = (event) => this.setState({ password: event.target.value });
  onChangeAdminId = (event) => this.setState({ adminId: event.target.value });

  onChangeForgotEmail = (event) => this.setState({ forgotEmail: event.target.value });
  onChangeForgotAdminId = (event) => this.setState({ forgotAdminId: event.target.value });

  handleUserTypeClick = (type) => {
    this.setState({ userType: type, showSubmitError: false });
  };

  submitForm = (event) => {
    event.preventDefault();
    const { email, password, adminId, userType, users } = this.state;

    if (email === "" || password === "" || (userType === "admin" && adminId === "")) {
      this.setState({ showSubmitError: true, errorMsg: "⚠️ Please fill all required fields" });
      return;
    }

    if (userType === "admin") {
      const matchedAdmin = users.find(
        (user) =>
          user.userType === "admin" &&
          user.email === email &&
          user.password === password &&
          user.adminId === adminId
      );

      if (matchedAdmin) {
        this.props.navigate("/admin");
      } else {
        this.setState({ showSubmitError: true, errorMsg: "Invalid credentials" });
      }
    } else {
      const matchedStudent = users.find(
        (user) =>
          user.userType === "student" &&
          user.email === email &&
          user.password === password
      );

      if (matchedStudent) {
        this.props.navigate("/student");
      } else {
        this.setState({ showSubmitError: true, errorMsg: "Invalid credentials" });
      }
    }
  };

  submitForgotPassword = () => {
    const { forgotEmail, forgotAdminId, users, userType } = this.state;

    if (forgotEmail === "" || (userType === "admin" && forgotAdminId === "")) {
      this.setState({ forgotResult: "⚠️ Please enter all required fields" });
      return;
    }

    const matchedUser = users.find(
      (user) =>
        user.email === forgotEmail &&
        user.userType === userType &&
        (userType === "student" || (userType === "admin" && user.adminId === forgotAdminId))
    );

    if (matchedUser) {
      this.setState({ forgotResult: `Your password is: ${matchedUser.password}` });
    } else {
      this.setState({ forgotResult: "User not found" });
    }
  };

  renderPasswordField = () => (
    <>
      <label className="input-label" htmlFor="password">PASSWORD</label>
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
      <label className="input-label" htmlFor="email">EMAIL</label>
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
      <label className="input-label" htmlFor="adminId">ADMIN ID</label>
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
    const { showSubmitError, errorMsg, userType, showForgotPopup, forgotEmail, forgotAdminId, forgotResult } = this.state;

    return (
      <div className="login-form-container">
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

        <form className="form-container" onSubmit={this.submitForm}>
          <img src="/Corpitsoftlogo.png" className="login-website-logo-desktop-img" alt="website logo" />

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
          {userType === "admin" && <div className="input-container">{this.renderAdminIdField()}</div>}
          <div className="input-container">{this.renderPasswordField()}</div>

          <div className="forgot">
            <p className="forgot-text" onClick={() => this.setState({ showForgotPopup: true })}>
              Forgot Password?
            </p>
            <Link to="/register" className="register-link">Register</Link>
          </div>

          <button type="submit" className="login-button">Login</button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>

        {/* ===== Forgot Password Popup ===== */}
        {showForgotPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <button
                className="close-btn"
                onClick={() =>
                  this.setState({ showForgotPopup: false, forgotEmail: "", forgotAdminId: "", forgotResult: "" })
                }
              >
                ×
              </button>
              <h2>Forgot Password</h2>
              <input
                type="email"
                placeholder="Enter Email"
                value={forgotEmail}
                onChange={this.onChangeForgotEmail}
              />
              {userType === "admin" && (
                <input
                  type="text"
                  placeholder="Enter Admin ID"
                  value={forgotAdminId}
                  onChange={this.onChangeForgotAdminId}
                />
              )}
              <button onClick={this.submitForgotPassword}>Submit</button>
              {forgotResult && (
                <>
                  <p style={{ marginTop: "10px" }}>{forgotResult}</p>
                  <button
                    className="login-button"
                    style={{ marginTop: "10px", width: "50%" }}
                    onClick={() => this.setState({ showForgotPopup: false, forgotEmail: "", forgotAdminId: "", forgotResult: "" })}
                  >
                    Back to Login
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

function LoginWithNavigate(props) {
  const navigate = useNavigate();
  return <Login {...props} navigate={navigate} />;
}

export default LoginWithNavigate;
