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
  const [isEditing, setIsEditing] = useState(false)
  const [editedListing, setEditedListing] = useState({ ...listing })
  const navigate = useNavigate()

  //comments
  const [comments, setComments] = useState([])
  const [newEmail, setNewEmail] = useState('')
  const [newComment, setNewComment] = useState('')
  const [posting, setPosting] = useState(false)
  const [commentsError, setCommentsError] = useState(null)

  
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
      <div className='buttons'>Edit Delete
      <button onClick={() => setIsEditing(!isEditing)}>
      {isEditing ? 'Cancel Edit' : 'Edit Listing'}
      </button>
      <button onClick={handleDelete}>Delete Listing</button>


      </div>

  {isEditing ? (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const { error } = await supabase
          .from('listings')
          .update(editedListing)
          .eq('id', listing.id)

        if (error) {
          console.error('Error updating listing:', error)
          alert('Update failed.')
        } else {
          setListing(editedListing)
          setIsEditing(false)
          alert('Listing updated!')
        }
      }}
    >
      <div>Title</div>
      <input
        type="text"
        value={editedListing.title}
        onChange={(e) =>
          setEditedListing({ ...editedListing, title: e.target.value })
        }
        placeholder="Title"
      />

      <div>Category</div>
      <input
        type="text"
        value={editedListing.category}
        onChange={(e) =>
          setEditedListing({ ...editedListing, category: e.target.value })
        }
        placeholder="Category"
      />

      <div>Condition</div>
      <input
        type="text"
        value={editedListing.condition}
        onChange={(e) =>
          setEditedListing({ ...editedListing, condition: e.target.value })
        }
        placeholder="Condition"
      />

      <div>Description</div>
      <textarea
        value={editedListing.description}
        onChange={(e) =>
          setEditedListing({ ...editedListing, description: e.target.value })
        }
        placeholder="Description"
      />

      <div>Contact</div>
      <input
        type="text"
        value={editedListing.contact}
        onChange={(e) =>
          setEditedListing({ ...editedListing, contact: e.target.value })
        }
        placeholder="Contact"
      />
      <button type="submit">Save Changes</button>
    </form>
  ) : (
    <>
      <h1>{listing.title}</h1>
      {listing.image_url && (
        <img src={listing.image_url} alt={listing.title} />
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
    </>
  )}
</div>
<div className="comments-section">
  <h3>Comments</h3>

  {commentsError && <p style={{ color: 'red' }}>{commentsError}</p>}

  <form className="comment-form" onSubmit={handleCommentSubmit}>
    <input
      type="email"
      placeholder="Email (optional)"
      value={newEmail}
      onChange={(e) => setNewEmail(e.target.value)}
    />
    <input
      type="text"
      placeholder="Write a comment..."
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      required
    />
    <button type="submit" disabled={posting}>
      {posting ? 'Posting...' : 'Post Comment'}
    </button>
  </form>

  <div className="comment-view">
    {comments.length === 0 ? (
      <p>No comments yet.</p>
    ) : (
      comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <p className="comment-content">💬 {comment.content}</p>
          <p className="comment-meta">
            {comment.author_email ? (
              <span>{comment.author_email}</span>
            ) : (
              <span>Anonymous</span>
            )}
            {' • '}
            {new Date(comment.created_at).toLocaleString()}
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

