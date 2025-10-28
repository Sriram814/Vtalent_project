import React, { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./header.css"

const Header = () => {
  const navigate = useNavigate()

  // dropdown state
  const [open, setOpen] = useState(false)
  const [profileMenu, setProfileMenu] = useState(false)
  const [studentInput, setStudentInput] = useState(false)
  const [studentName, setStudentName] = useState("")
  const [studentDetails, setStudentDetails] = useState(null)
  const [user, setUser] = useState(null) // 🔹 store logged-in user
  const dropdownRef = useRef(null)

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleToggle = () => {
    setOpen(!open)
    setProfileMenu(false)
    setStudentInput(false)
    setStudentName("")
    setStudentDetails(null)
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("currentUser") // 🔹 clear stored user
    navigate("/") // redirect to login
  }

  const handleProfileClick = () => {
    setProfileMenu(true)
    setStudentInput(false)
    setStudentDetails(null)
  }

  const handleStudentProfile = () => {
    setStudentInput(true)
    setStudentDetails(null)
    setStudentName("")
  }

  const handleBackToMain = () => {
    setProfileMenu(false)
    setStudentInput(false)
    setStudentName("")
    setStudentDetails(null)
  }

  const handleBackToProfile = () => {
    setStudentInput(false)
    setStudentDetails(null)
    setStudentName("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStudentDetails({
      name: studentName,
      email: studentName.toLowerCase() + "@example.com",
      class: "10th ",
      rollNo: "29",
      phone: "9441420442",
    })
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
        setProfileMenu(false)
        setStudentInput(false)
        setStudentName("")
        setStudentDetails(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <div className="nav-bar-large-container">
          {/* LEFT SIDE */}
          <div className="nav-left">
            {/* <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="profile"
              className="profile-icon"
            /> */}
            <Link to="/home">
              <img
                className="website-logo"
                src="/Corpitsoftlogo.png"
                alt="website logo"
              />
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="nav-right">
            {/* <ul className="nav-menu">
                <li className="nav-menu-item">
                  <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-menu-item">
                  <Link to="/quizes" className="nav-link">Quizes</Link>
                </li>
                <li className="nav-menu-item">
                  <Link to="/history" className="nav-link">History</Link>
                </li> 
              </ul>*/}

            {/* ✅ Profile dropdown at end */}
            <div className="profile-section" ref={dropdownRef}>
              {/* 🔹 Avatar instead of static image */}
              <div
                className="profile-avatar"
                style={{
                  backgroundColor: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
                }}
                onClick={handleToggle}
              >
                {user ? user.email.charAt(0).toUpperCase() : "U"}
              </div>

              {open && (
                <div className="dropdown-menu">
                  {!profileMenu && !studentInput ? (
                    <>
                      <p className="dropdown-item" onClick={handleProfileClick}>
                        Profile {user?.userType === "admin" ? "Admin" : "Student"}
                      </p>
                      <p className="dropdown-item">Manage Quizes</p>
                      <p className="dropdown-item">Students Results</p>
                      <p className="dropdown-item">Settings</p>
                      <p className="dropdown-item logout" onClick={handleLogout}>
                        Logout
                      </p>
                    </>
                  ) : profileMenu && !studentInput ? (
                    <>
                      <p className="dropdown-item back" onClick={handleBackToMain}>
                        ← Back
                      </p>
                      <p className="dropdown-item">
                        {user?.userType === "admin" ? "Admin Profile" : "Student Profile"}
                      </p>
                      {user?.userType === "admin" && (
                        <p className="dropdown-item" onClick={handleStudentProfile}>
                          Student Profile
                        </p>
                      )}
                    </>
                  ) : studentInput && !studentDetails ? (
                    <form className="student-form" onSubmit={handleSubmit}>
                      <p className="dropdown-item back" onClick={handleBackToProfile}>
                        ← Back
                      </p>
                      <input
                        type="text"
                        placeholder="Enter Student Name"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                        className="student-input"
                      />
                      <button type="submit" className="student-submit">
                        Submit
                      </button>
                    </form>
                  ) : studentDetails ? (
                    <>
                      <p className="dropdown-item back" onClick={handleBackToProfile}>
                        ← Back
                      </p>
                      <p className="dropdown-item">Name: {studentDetails.name}</p>
                      <p className="dropdown-item">Email: {studentDetails.email}</p>
                      <p className="dropdown-item">Class: {studentDetails.class}</p>
                      <p className="dropdown-item">Roll No: {studentDetails.rollNo}</p>
                      <p className="dropdown-item">Phone: {studentDetails.phone}</p>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header
