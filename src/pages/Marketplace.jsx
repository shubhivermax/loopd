import React from 'react'
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/target-page'); // replace with your route
  };

  return (
    <div>
      <div>Marketplace</div>

      <div className='left'>
         <div className='gallery'></div>
      </div>

      <div className='right'>
        <div className='sidebar'>
          <button
            onClick={handleClick}
          >
            Link to Post
          </button>
        </div>
      </div>
    </div>
  )
}

export default Marketplace