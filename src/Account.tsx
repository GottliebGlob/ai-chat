import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Session } from "@supabase/gotrue-js/src/lib/types"




const Account = ({session}: {session: Session}) => {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string | null>(null)
  const [contacts, setContacts] = useState<string[]>([]) 

  useEffect(() => {
    getProfile()
   getContacts()
  }, [session])


  useEffect(() => {
    const profiles = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `user_from=eq.${session?.user.id}` },
        (payload) => {
          console.log({ payload });
        }
      )
      .subscribe();
    return () => {
      profiles.unsubscribe();
    };
  }, []);

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

  const getContacts = async () => {
    try {
      setLoading(true)
      const { user } = session

      let { data, error, status } = await supabase
        .from('chat_users')
        .select('chat_id')
        .eq('user_id', user.id)

      if (error && status !== 406) {
        throw error
      }
      if (data) {
        let decomposed = data.map(x => x.chat_id)
       setContacts([...contacts, ...decomposed])
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
    <div aria-live="polite" className="flex justify-center items-center h-screen w-screen flex-col bg-slate-500">
      {loading ? (
        'Saving ...'
      ) : (
        <form onSubmit={updateProfile} className="flex justify-center items-center flex-col">
          <div >
            <label htmlFor="username" className="font-bold text-xl m-2 text-white">Name</label>
            <input
              id="username"
              type="text"
              value={username || ''}
              className="p-2 rounded-md"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            />
          </div>
       
          
          <button className="bg-blue-500 rounded-md p-2 font-bold m-4 text-white" disabled={loading}>
              Update profile
            </button>

                
        </form>
      )}
      <button type="button" className="bg-red-500 rounded-md p-2 font-bold m-1 text-white absolute top-1 right-1" onClick={() => supabase.auth.signOut()}>
        Sign Out
      </button>
    </div>
    
  )
}

export default Account

