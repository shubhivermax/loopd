import React from 'react'
import logo from '../assets/loghome.png';
import fashion1 from '../assets/fashion1.png';
import fashion2 from '../assets/fashion2.png';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/Market')
  }

  const handleSignIn = () => {
    navigate('/SignUp')
  }
  return (
    <div className='homepage'>
      <div className='fashion-image-container'>
        <img src={fashion1} alt="fashion1" className='fashion-image fashion-image-left' />
        <img src={fashion2} alt="fashion2" className='fashion-image fashion-image-right' />
      </div>
      <div className='homepage-content'>
        <div className='homepage-logo'>
          <img src={logo} alt="logo" className='homepage-logo-img' />
          <div className='homepage-tagline'>Your all-in-one fashion marketplace & thrift swap!</div>
          
        </div>
        <button className='explore' onClick={handleClick}>Explore</button>
        <button className='explore' onClick={handleSignIn}>Sign Up/Login</button>
      </div>
    </div>
  )
}

export default Home;
