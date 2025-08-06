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
  return (
    <div className='homepage'>
      <div className='fashion-image-container'>
        <img src={fashion1} alt="fashion1" className='fashion-image fashion-image-left' />
        <img src={fashion2} alt="fashion2" className='fashion-image fashion-image-right' />
      </div>
      <div className='homepage-content'>
        <div className='homepage-logo'>
          <img src={logo} alt="logo" className='homepage-logo-img' />
          <div className='homepage-tagline'>Your all-in-one campus fashion marketplace</div>
          
        </div>
        <button onClick={handleClick}>Explore</button>
      </div>
    </div>
  )
}

export default Home;
