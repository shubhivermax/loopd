import { useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const ListingDetail = () => {
  const { id } = useParams()
  const location = useLocation()
  const [listing, setListing] = useState(location.state?.listing || null)
  const [loading, setLoading] = useState(!listing)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!listing) {
      // fallback: fetch if not passed via navigation
      ;(async () => {
        setLoading(true)
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single()
        if (error) {
          console.error('Error fetching listing:', error)
          setError('Could not load listing.')
        } else {
          setListing(data)
        }
        setLoading(false)
      })()
    }
  }, [id, listing])

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  if (!listing) return <p>Listing not found.</p>

  return (
    <div className='detailwrapper'>
      <h1>{listing.title}</h1>
      {listing.image_url && (
        <img
          src={listing.image_url}
          alt={listing.title}
          
        />
      )}
      <p>
        <strong>Category:</strong> {listing.category}
      </p>
      <p>
        <strong>Condition:</strong> {listing.condition}
      </p>
      <p>
        <strong>Description:</strong>{' '}
        {listing.description || 'No description provided.'}
      </p>
      <p>
        <strong>Contact:</strong> {listing.contact || 'Not specified'}
      </p>
      <p>
        <strong>Upvotes:</strong> {listing.upvotes || 0}
      </p>
    </div>
  )
}

export default ListingDetail
