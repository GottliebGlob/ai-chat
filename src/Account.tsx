import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { Session } from "@supabase/gotrue-js/src/lib/types";
import SideBar from "./components/SideBar";
import NameForm from "./components/NameForm";

const Account = ({ session }: { session: Session }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    getProfile();
    getContacts();
  }, [session]);

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

  const getProfile = async () => {
    try {
      setLoading(true);
      const { user } = session;

      let { data, error, status } = await supabase
        .from("users")
        .select(`username`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getContacts = async () => {
    try {
      setLoading(true);
      const { user } = session;

      let { data, error, status } = await supabase
        .from("users_chat")
        .select("users (username, id)")
        .neq("user_id", user.id);

      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        let decomposed: Contact[] = data.map((x: any) => {
          return {
            name: x.users.username,
            id: x.users.id,
          };
        });

        setContacts([...contacts, ...decomposed]);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { user } = session;

      const updates = {
        id: user.id,
        username,
      };

      let { error } = await supabase.from("users").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SideBar contacts={contacts} />

      {
        username?.length === 0 && <NameForm
          updateProfile={updateProfile}
          username={username}
          setUsername={setUsername}
          loading={loading}
        />
      }

      <button
        type="button"
        className="bg-red-500 rounded-md p-2 font-bold m-1 text-white absolute top-1 right-1"
        onClick={() => supabase.auth.signOut()}
      >
        Sign Out
      </button>
    </>
  );
};

export default Account;
