import './index.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import Account from './Account'
import { Session } from "@supabase/gotrue-js/src/lib/types"

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div
    aria-live="polite"
    className="flex justify-center items-center h-screen w-screen flex-col bg-slate-200"
  >
      {!session ? <Auth /> : <Account key={session.user.id} session={session} />}
    </div>
  )
}