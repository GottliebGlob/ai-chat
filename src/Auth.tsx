import React, { useState } from 'react'
import { supabase } from './supabaseClient'

const Auth = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithOtp({ email })

      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error: any) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
       <h3 className='font-bold text-blue-800 text-4xl mb-2'>AI Chat</h3>
        <p className="text-blue-600 m-2">Sign in via magic link with your email below</p>
        {loading ? (
          'Sending magic link...'
        ) : (
          <form onSubmit={handleLogin} className="m-2">
        
            <input
              id="email"
              className="p-3 rounded-md"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="bg-blue-500 rounded-md p-3 font-bold m-4 text-white" aria-live="polite">
              Send magic link
            </button>
          </form>
        )}
  
    </>
  )
}

export default Auth