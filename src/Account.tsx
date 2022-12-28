import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Session } from "@supabase/gotrue-js/src/lib/types"




const Account = ({session}: {session: Session}) => {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string | null>(null)
 

  useEffect(() => {
    getProfile()
  }, [session])

  const getProfile = async () => {
    try {
      setLoading(true)
      const { user } = session

      let { data, error, status } = await supabase
        .from('users')
        .select(`username`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { user } = session

      const updates = {
        id: user.id,
        username
      }

      let { error } = await supabase.from('users').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div aria-live="polite" className="flex justify-center items-center h-screen w-screen flex-col">
      {loading ? (
        'Saving ...'
      ) : (
        <form onSubmit={updateProfile} className="form-widget">
          <div>Email: {session.user.email}</div>
          <div>
            <label htmlFor="username">Name</label>
            <input
              id="username"
              type="text"
              value={username || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            />
          </div>
          <div>
          
          </div>
          <div>
            <button className="button primary block" disabled={loading}>
              Update profile
            </button>
          </div>
        </form>
      )}
      <button type="button" className="bg-red-500 rounded-md p-2 font-bold m-1" onClick={() => supabase.auth.signOut()}>
        Sign Out
      </button>
    </div>
    
  )
}

export default Account

