import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'


const PostItem = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
  const fetchUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };
  fetchUser();

  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user || null);
  });

  return () => listener.subscription.unsubscribe();
}, []);

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [condition, setCondition] = useState('Like New')
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!title.trim() || !category.trim()) {
      setErrorMsg('Please fill in all required fields.')
      return
    }

    setUploading(true)
    let image_url = null

    
    // Optional: Upload image if provided
    if (imageFile) {
      console.log('Uploading:', imageFile)
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: imageFile.type,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        setErrorMsg('Image upload failed.')
        setUploading(false)
        return
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      image_url = publicData.publicUrl
    }

    // Insert listing
    const { error: insertError } = await supabase.from('listings').insert([
      {
        title: title.trim(),
        description: description.trim() || null,
        category: category.trim(),
        condition,
        image_url,
        contact: '', // can update later with user auth
        user_id: user?.id, 
      },
    ])

    setUploading(false)

    if (insertError) {
      console.error('Insert error:', insertError)
      setErrorMsg('Failed to save listing.')
    } else {
      setSuccessMsg('Listing posted! 🎉')
      setTimeout(() => navigate('/'), 1000)
    }
  }

  return (
    <div className="marketplace-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 className="marketplace-title">Post an Item</h1>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '16px', borderRadius: '10px', boxShadow: '0 6px 16px rgba(0,0,0,0.04)' }}>
        {errorMsg && <p className="error">{errorMsg}</p>}
        {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

        <div style={{ marginBottom: '12px' }}>
          <label>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Graphic Tee"
            style={{ width: '100%', padding: '8px',backgroundColor:'#543737', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add any item details..."
            rows={3}
            style={{ width: '100%', padding: '8px', backgroundColor:'#543737', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Category *</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Tops, Shoes"
            style={{ width: '100%', padding: '8px',backgroundColor:'#543737', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Condition *</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            style={{ width: '100%', backgroundColor:'#543737', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Gently Used">Gently Used</option>
            <option value="Well Worn">Well Worn</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          style={{
            padding: '12px 20px',
            backgroundColor: '#543737',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          {uploading ? 'Posting...' : 'Post Item'}
        </button>
      </form>
    </div>
  )
}

export default PostItem

