import { useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

const ListingDetail = () => {
  const { id } = useParams()
  const location = useLocation()
  const [listing, setListing] = useState(location.state?.listing || null)
  const [loading, setLoading] = useState(!listing)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Comment state
  const [comments, setComments] = useState([])
  const [newEmail, setNewEmail] = useState('')
  const [newComment, setNewComment] = useState('')
  const [posting, setPosting] = useState(false)
  const [commentsError, setCommentsError] = useState(null)

  // Fetch listing if not passed through state
  useEffect(() => {
    if (!listing) {
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

  useEffect(() => {
    if (listing) {
      fetchComments()
    }
  }, [listing])

  async function fetchComments() {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('listing_id', id)
      .order('created_at', { ascending: true })
    if (error) {
      console.error('Failed to fetch comments:', error)
      setCommentsError('Could not load comments.')
    } else {
      setComments(data || [])
    }
  }

  async function handleCommentSubmit(e) {
    e.preventDefault()
    if (!newComment.trim()) return

    setPosting(true)
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          listing_id: id,
          author_email: newEmail || null,
          content: newComment.trim(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error posting comment:', error)
      setCommentsError('Failed to post comment.')
    } else {
      setComments((prev) => [...prev, data])
      setNewEmail('')
      setNewComment('')
    }

    setPosting(false)
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  if (!listing) return <p>Listing not found.</p>

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmDelete) return;
  
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', listing.id);
  
    if (error) {
      console.error('❌ Delete failed:', error);
      alert('Delete failed. Please try again.');
    } else {
      alert('Listing deleted!');
      // navigate back to the marketplace
      
      navigate('/Market')

    }
  };

  return (
    <div>
      

      <div className="detailwrapper">
        <button onClick={handleDelete}>Delete Listing</button>
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

      <div className="comments-section">
        <div className="comment-form">
          <div>Add a Comment</div>
          <form onSubmit={handleCommentSubmit}>
            <input
              type="email"
              placeholder="Email (optional)"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Your comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" disabled={posting || !newComment.trim()}>
              {posting ? 'Posting...' : 'Go'}
            </button>
          </form>
          {commentsError && <p className="error">{commentsError}</p>}
        </div>

        <div className="comment-view">
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="comment-card">
                <p>
                  <strong>{c.author_email || 'Anonymous'}:</strong> {c.content}
                </p>
                <p className="timestamp">
                  {new Date(c.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ListingDetail

