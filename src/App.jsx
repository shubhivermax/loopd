// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient';

import Home from './pages/Home';
import About from './pages/About';
import Navbar from './components/Navbar';
import How from './pages/How';
import Market from './pages/Marketplace';
import Post from './pages/Post';
import ListingDetail from './pages/ListingDetail'
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Welcome from './components/Welcome';

import './App.css';

function App() {

  const [message, setMessage] = useState('')

  useEffect(() => {
    // Check current session
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          setMessage('Error checking session.')
        } else if (session) {
          setMessage('You are logged in.')
          console.log('Logged in user:', session.user)
        }
      })
  }, [])

  const handleSignOut = () => {
    supabase.auth.signOut()
    alert('You have been logged out')
    Navigate('/')
    
  }

  return (
    <div>
      <Navbar />
      <Welcome />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/How" element={<How />} />
        <Route path="/Market" element={<Market />} />
        <Route path="/Post" element={<Post />} />
        <Route path="/listing/:id" element={<ListingDetail />} />

        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        {/* Add more routes as needed */}

      </Routes>
    </div>
  );
}

export default App;
