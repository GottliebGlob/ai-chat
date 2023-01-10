import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { Session } from "@supabase/gotrue-js/src/lib/types";
import SideBar from "./components/SideBar";
import NameForm from "./components/NameForm";
import { getContacts, getMessages, getProfile, messageSubscription, updateProfile } from "./utils/supabase";

const Account = ({ session }: { session: Session }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    getProfile({setLoading, setUser, session, supabase});
    getContacts({setLoading, setContacts, session, supabase});
  }, []);


  useEffect(() => {
    if (activeContact !== null) {
      getMessages({setLoading, setMessages, messages, session, supabase, activeContact})
      messageSubscription({supabase, activeContact, setMessages})
    }
  }, [activeContact])

  

 
  return (
    <>
      <SideBar contacts={contacts} setContact={setActiveContact} />

      {user?.name.length === 0 && (
        <>
          <NameForm
            updateProfile={(e) => updateProfile({
              setLoading, session, supabase, e, user
            })}
            user={user}
            setUser={setUser}
            loading={loading}
          />
        </>
      )}

      <div className="bg-blue-600 rounded-xl absolute m-1 top-3 left-60">
        <h1 className="font-bold text-white text-xl p-2">{
          activeContact ? activeContact.name : user?.name
        }</h1>
      </div>

      <div className="flex pl-60 pr-60 pb-10 pt-20 w-full h-full">
      <div className="container mx-auto bg-white p-4 rounded-xl">
        {
       messages?.map((element) => {
      
        return (
          <div key={element.id} className={`flex ${element.user_from !== user?.id ? "justify-start" : "justify-end"}`}>
          <div className={`rounded-xl ${element.user_from !== user?.id ? "bg-blue-500" : "bg-blue-600"}`}>
              <h3 className={`font-bold text-white text-xl p-2`}> 
              {element.content}
              </h3>
            </div>
            </div>
        )
       })
      }
      </div>

      </div>

      <button
        type="button"
        className="bg-red-500 rounded-xl p-2 font-bold m-1 text-white absolute top-1 right-1"
        onClick={() => supabase.auth.signOut()}
      >
        Sign Out
      </button>
    </>
  );
};

export default Account;
