import React from 'react'
import { useNavigate } from 'react-router-dom';

const How = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/Market');
  }

  return (


    <div className='howb'>
        <div className='how-it-works'>How it Works</div>
        <div className='steps'>
            <div>1. 📸 Snap and Post</div>
            <div>2. 🔄 Browse and Buy</div>
            <div>3. ♻️ Keep the Loop going</div>
        </div>
        <div className='visit'>
          <button className='visbut' onClick={handleClick}>Visit the Marketplace</button>

        </div>

        <p className="blurb-text">
  Every item bought secondhand is one less added to landfills. Loopd is your stylish step toward sustainable fashion — rewear, resell, and reduce waste, one outfit at a time.
</p>



    </div>
  )
}

export default How;