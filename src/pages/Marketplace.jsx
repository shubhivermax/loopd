import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const Marketplace = () => {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchListings()
    // Debug: Check what tables are available
    debugTables()
  }, [])

  async function debugTables() {
    console.log('🔍 Checking available tables...')
    // This will help us see if the table exists
    const { data, error } = await supabase
      .from('listings')
      .select('count')
      .limit(1)
    
    console.log('📊 Table check result:', { data, error })
  }

  async function fetchListings() {
    setLoading(true)
    console.log('🔍 Fetching listings from Supabase...')
    
    // First, let's try a simple query without ordering
    const { data, error } = await supabase
      .from('listings')
      .select('*')

    console.log('📊 Supabase response:', { data, error })

    if (error) {
      console.error('❌ Error fetching listings:', error)
      setErrorMsg('Failed to load listings.')
    } else {
      console.log('✅ Successfully fetched listings:', data)
      console.log('📝 Number of listings found:', data?.length || 0)
      setListings(data || [])
    }
    setLoading(false)
  }

  const goToPostPage = () => {
    navigate('/post') // adjust if your route is different
  }

  const goToDetail = (id) => {
    navigate(`/listing/${id}`) // implement detail route later
  }

  return (
    <div className="marketplace-container">
      <header>
        <h1 className="marketplace-title">Loopd Marketplace</h1>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <button onClick={goToPostPage}>Post an Item</button>
          {/* future: filter UI */}
        </aside>

        <main className="listings-area">
          {loading && <p>Loading listings...</p>}
          {errorMsg && <p className="error">{errorMsg}</p>}
          {!loading && listings.length === 0 && <p>No listings yet. Be the first to post!</p>}

          <div className="listings-grid">
            {listings.map((item) => (
              <div
                key={item.id}
                className="listing-card"
                onClick={() => goToDetail(item.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="image-wrapper">
                  <img
                    src={item.image_url || 'https://placehold.co/300x400?text=No+Image'}
                    alt={item.title || 'Untitled'}
                    className="listing-image"
                  />
                </div>
                <div className="listing-info">
                  <h2 className="listing-title">{item.title || 'Untitled'}</h2>
                  <p className="listing-meta">{item.category || 'Uncategorized'}</p>
                  <p className="listing-condition">{item.condition || ''}</p>
                  <p className="listing-description">{item.description}</p>
                  <p className="listing-contact">
                    <small>Contact: {item.contact || 'N/A'}</small>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Marketplace



/*
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
  */