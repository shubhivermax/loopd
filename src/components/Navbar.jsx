import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../App.css';
import { useState } from 'react'

const Navbar = () => {

  const [darkMode, setDarkMode] = useState(true)

  return (
    <nav className={`navbar ${darkMode ? 'dark' : 'light'}`}>
      <div className='logo'>
        <img src={logo} alt="logo" className="logo-img"/>
      </div>



      <div className="nav-links">

        <Link to="SignUp" className='nav-link'>Sign Up</Link>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/How" className='nav-link'>How it Works</Link>
        <Link to="/Market" className='nav-link'>Market</Link>
        <Link to="/About" className="nav-link">About</Link>
        <Link to="/Login" className="nav-link">Login</Link>
        <button onClick={() => setDarkMode(!darkMode)}>
  {darkMode ? '🌞' : '🌙'}
</button>
        
      </div>
    </nav>
  )
}

export default Navbar;