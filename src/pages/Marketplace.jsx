import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Marketplace = () => {

  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .limit(1) // just fetch one row for testing

      if (error) {
        console.error('❌ Supabase connection failed:', error)
      } else {
        console.log('✅ Supabase connected successfully. Data:', data)
      }
    }

    testConnection()
  }, [])



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