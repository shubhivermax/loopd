import { supabase } from '../supabaseClient'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import React from 'react'

const SignUp = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)


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

  useEffect(() => {
    if (user) {
      alert('You are already logged in.')
      navigate('/Market')
    }
  }, [user])

  
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [contact, setContact] = useState('')
    const [message, setMessage] = useState('')

    const handleSignUp = async (e) => {
        e.preventDefault()
    
        // 1. Restrict to USF emails
        if (!email.endsWith('@usf.edu') && !email.endsWith('@mail.usf.edu')) {
          setMessage('Please use your USF email address')
          return
        }
    
        // 2. Sign up with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        })
    
        if (authError) {
          setMessage(authError.message)
          return
        }
    
        // 3. Insert into Users table
        const { data: userData, error: userError } = await supabase
          .from('Profiles')
          .insert([
            {
              id: authData.user.id, // links the Users row to Auth user
              full_name: fullName,
              contact_info: contact,
            },
          ])
    
        if (userError) {
          setMessage(userError.message)
          return
        }
    
        setMessage('Sign-up successful! Check your USF email to verify your account.')
      }


  return (
    <div className="signup-container">
      <h2>Sign Up For Loopd</h2>
      <form onSubmit={handleSignUp} className="signup-form">
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="USF Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Contact Info (IG, Venmo, etc.)"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <button onClick={() => navigate('/login')}>Already have an account? Log In.</button>  
      {message && <p>{message}</p>}
    </div>
  )
    
  
}

export default SignUp