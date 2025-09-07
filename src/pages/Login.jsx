import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault()

    // 1. Sign in with Supabase Auth
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setMessage(loginError.message)
      return
    }

    // 2. Check email verification
    if (!loginData.user.email_confirmed_at) {
      setMessage('Please verify your USF email before logging in.')
      return
    }

    // 3. Fetch user profile from Profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('Profiles')
      .select('*')
      .eq('id', loginData.user.id)
      .single()

    if (profileError) {
      setMessage(profileError.message)
      return
    }

    // 4. Success
    setMessage(`Welcome back, ${profileData.full_name}!`)
    console.log('Profile Data:', profileData)

    // 5. REDIRECTING TO MARKETPLACE 
    navigate('../Market')

    // e.g., navigate('/dashboard')
  }

  return (
    <div className="login-container">
      <h2>Login to Loopd</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="USF Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default Login