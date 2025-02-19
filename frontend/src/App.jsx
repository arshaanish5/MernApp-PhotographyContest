import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Router, Routes } from 'react-router-dom'
import Home from './components/Home'
import Navbar from './components/Navbar'
import Login from './components/Login'
import CreateContest from './components/AddContest'
import Contest from './components/Contest'
import User from './components/Users'
import UploadImage from './components/UploadImage'
import ContestDetail from './components/contestDetail'
import UpdateContest from './components/UpdateContest'
import Profile from './components/Profile'
import Leaderboard from './components/Leaderboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path='/createcontest' element={<CreateContest/>}/>
        <Route path="/contest" element={<Contest />} />
        <Route path="/user" element={<User />} />
        <Route path="/contest/upload/:contestId" element={<UploadImage />} />
        <Route path="/contest/:contestId" element={<ContestDetail />} />
        <Route path="/contest/update/:id" element={<UpdateContest />} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/leaderboard' element={<Leaderboard/>}/>
      </Routes>
    </>
  )
}

export default App
