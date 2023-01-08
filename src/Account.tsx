import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { Session } from "@supabase/gotrue-js/src/lib/types";
import SideBar from "./components/SideBar";
import NameForm from "./components/NameForm";
import { getContacts, getProfile, updateProfile } from "./utils/supabase";

const Account = ({ session }: { session: Session }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);

  useEffect(() => {
    getProfile({setLoading, setUsername, session, supabase});
    getContacts({setLoading, setContacts, session, supabase, contacts});
  }, []);

  useEffect(() => {
    const profiles = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `user_from=eq.${session?.user.id}`,
        },
        (payload) => {
          console.log({ payload });
        }
      )
      .subscribe();
    return () => {
      profiles.unsubscribe();
    };
  }, []);

 
  return (
    <>
      <SideBar contacts={contacts} setContact={setActiveContact} />

      {username?.length === 0 && (
        <>
          <NameForm
            updateProfile={(e) => updateProfile({
              setLoading, session, supabase, e, username
            })}
            username={username}
            setUsername={setUsername}
            loading={loading}
          />
        </>
      )}

      <div className="bg-blue-600 rounded-xl absolute m-1 top-3 left-60">
        <h1 className="font-bold text-white text-xl p-2">{
          activeContact ? activeContact.name : username
        }</h1>
      </div>

      <div className="flex pl-60 pr-60 pb-10 pt-20 w-full h-full">
      <div className="container mx-auto bg-white p-4 rounded-xl">
        {
       
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
