import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const Marketplace = () => {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)
  const [sortOrder, setSortOrder] = useState('newest')
  const navigate = useNavigate()

  useEffect(() => {
    fetchListings()
    // Debug: Check what tables are available
    debugTables()
  }, [sortOrder])

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
    const ascending = sortOrder === 'oldest'
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: ascending })

    if (error) {
      console.error('❌ Error fetching listings:', error)
      setErrorMsg('Failed to load listings.')
      setListings([])
    } else {
      setListings(data || [])
      setErrorMsg(null)
    }
    setLoading(false)
  }

  async function fetchPopularListings() {
    setLoading(true)
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('upvotes', { ascending: false })

    if (error) {
      console.error('❌ Error fetching listings:', error)
      setErrorMsg('Failed to load listings.')
      setListings([])
    } else {
      setListings(data || [])
      setErrorMsg(null)
    }
    setLoading(false)
  }

  const handleUpvote = async (listingId, currentUpvotes) => {
    const newUpvotes = (currentUpvotes || 0) + 1
    
    const { error } = await supabase
      .from('listings')
      .update({ upvotes: newUpvotes })
      .eq('id', listingId)

    if (error) {
      console.error('❌ Error updating upvotes:', error)
    } else {
      // Refresh the listings to show updated upvotes
      if (sortOrder === 'popular') {
        fetchPopularListings()
      } else {
        fetchListings()
      }
    }
  }

  const goToPostPage = () => {
    navigate('/post')
  }

  const goToDetail = (item) => {
    navigate(`/listing/${item.id}`, { state: { listing: item } })
  }

  const handleSortChange = (order) => {
    setSortOrder(order)
    if (order === 'popular') {
      fetchPopularListings()
    } else {
      fetchListings()
    }
  }

  return (
    <div className="marketplace-container">
      <header>
        <h1 className="marketplace-title">Loopd Marketplace</h1>
      </header>

      <div className="layout">
        <aside className="sidebar">
          Order By
          <div className='filters'>
            <button 
              className={`but1 ${sortOrder === 'oldest' ? 'active' : ''}`}
              onClick={() => handleSortChange('oldest')}
            >
              Oldest
            </button>
            <button 
              className={`but1 ${sortOrder === 'newest' ? 'active' : ''}`}
              onClick={() => handleSortChange('newest')}
            >
              Newest
            </button>
            <button 
              className={`but1 ${sortOrder === 'popular' ? 'active' : ''}`}
              onClick={() => handleSortChange('popular')}
            >
              Popular
            </button>
          </div>

          Sell
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
                onClick={() => goToDetail(item)}
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
                  <div className="upvote-section">
                    <button
                      className="upvote-btn"
                      onClick={(e) => {
                        e.stopPropagation() // Prevent card click
                        handleUpvote(item.id, item.upvotes)
                      }}
                    >
                      👍 {item.upvotes || 0}
                    </button>
                  </div>
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