import { BrowserRouter,Route,Routes } from "react-router-dom"
// import Header from './components/Header/header'
import Login from './components/Login/login'
import Signup from './components/SignUp/signup'
import Admin from './components/Admin/Admin'
import Home from './components/Home/home'
import Quiz from './components/Quizes/quizes'
import Student from './components/Student/student'
import NotFound from './components/NotFound/index'

function App() {
  return (
    <BrowserRouter>
    
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/student" element={<Student />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/quizes" element={<Quiz />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
