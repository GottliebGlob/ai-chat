import { useState, createContext, useEffect } from "react";
import { supabase } from '../supabaseClient'
import { Session } from "@supabase/gotrue-js/src/lib/types"


interface AuthContextProps {
    children: React.ReactNode
}

export const AuthContext = createContext<Session | null>(null);


const AuthProvider = ({children}: AuthContextProps) => {
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
        <AuthContext.Provider value={session}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
