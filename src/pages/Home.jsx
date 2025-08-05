import React from 'react'
import logo from '../assets/logo.png';
import fashion1 from '../assets/fashion1.png';
import fashion2 from '../assets/fashion2.png';

const Home = () => {
  return (
    <div className='homepage'>
      <div className='fashion-image-container'>
        <img src={fashion1} alt="fashion1" className='fashion-image fashion-image-left' />
        <img src={fashion2} alt="fashion2" className='fashion-image fashion-image-right' />
      </div>
      <div className='homepage-content'>
        <div className='homepage-logo'>
          <img src={logo} alt="logo" className='homepage-logo-img' />
        </div>
      </div>
    </div>
  )
}

export default Home;
