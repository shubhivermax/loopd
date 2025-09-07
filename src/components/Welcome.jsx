import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

const Welcome = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const handleSignOut = () => {
    supabase.auth.signOut()
    alert('You have been logged out')
    Navigate('/')
  }

  useEffect(() => {
    // Check session on mount
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }

    fetchSession()

    // Listen for auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (!user) return null // Hide the welcome bar if not logged in

  return (
    <div className='welcome-bar'>
        <div>Welcome back, {user.email.split('@')[0]}!</div>
        <button className='welc-button' onClick={handleSignOut}>Logout</button>
    </div>
  )
}

export default Welcome
