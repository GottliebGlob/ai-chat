import './index.css'
import {useContext } from 'react'
import Auth from './Auth'
import Account from './Account'
import { AuthContext } from './context/AuthContext'

export default function App() {
  const session = useContext(AuthContext)

  return (
    <div
    aria-live="polite"
    className="flex justify-center items-center h-screen w-screen flex-col bg-slate-300"
  >
      {!session ? <Auth /> : <Account key={session.user.id} session={session} />}
    </div>
  )
}