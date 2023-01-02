import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Session } from "@supabase/gotrue-js/src/lib/types"






const Account = ({session}: {session: Session}) => {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([]) 

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
      .from('users_chat')
      .select('users (username, id)')
      .neq('user_id', user.id)

      if (error && status !== 406) {
        throw error
      }
      if (data) {
    
        let decomposed: Contact[] = data.map((x: any) => {return {
            name: x.users.username,
            id: x.users.id
        }})
        
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
    <div aria-live="polite" className="flex justify-center items-center h-screen w-screen flex-col bg-slate-200">

<aside className="fixed top-0 bottom-0 lg:left-0 p-2 w-[200px] overflow-y-auto text-center bg-blue-900">

<h1 className='font-bold text-white text-2xl mb-4'>
    Chats:
  </h1>

<div className="flex flex-col">
      {
          contacts.map((element, index) => {
            return (
              <div key={index} className="bg-blue-400 rounded-full m-3 p-5 h-8 w-8 flex justify-center items-center">
                <h3 className='font-bold text-white'>
                  {element.name.substr(0, 1)}
                </h3>
                 </div>
            )
          })
      }
            </div>
</aside>

      {loading ? (
        'Saving ...'
      ) : (
        <form onSubmit={updateProfile} className="flex justify-center items-center flex-col">
          <div >
            <label htmlFor="username" className="font-bold text-xl m-2 text-blue-800">Name</label>
            <input
              id="username"
              type="text"
              value={username || ''}
              className="p-2 rounded-md font-bold"
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

