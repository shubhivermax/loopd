import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../App.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className='logo'>
        <img src={logo} alt="logo" className="logo-img"/>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/How" className='nav-link'>How it Works</Link>
        <Link to="/Market" className='nav-link'>Market</Link>
        <Link to="/About" className="nav-link">About</Link>
        
      </div>
    </nav>
  )
}

export default Navbar;