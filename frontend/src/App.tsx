import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Blog from './pages/Blog'
import Createblog from './pages/Createblog'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/blog' element={<Blog />} />
        <Route path='/add-blog' element={<Createblog />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
