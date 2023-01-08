import { SupabaseClient } from '@supabase/supabase-js';
import { Session } from "@supabase/gotrue-js/src/lib/types"

interface getData {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    session: Session
    supabase: SupabaseClient<any, "public", any>
}


interface getProfileProps extends getData {
    setUsername: React.Dispatch<React.SetStateAction<string | null>>
}

export const getProfile = async ({setLoading, setUsername, session, supabase}: getProfileProps) => {
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

  interface getClientProps extends getData {
    setContacts: React.Dispatch<React.SetStateAction<Contact[]>>
    contacts: Contact[] }

  export const getContacts = async ({setLoading, setContacts, session, supabase, contacts}: getClientProps) => {
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

  interface getUpdateProps extends getData {
    e: React.SyntheticEvent 
    username: string | null
}

 export const updateProfile = async ({setLoading, session, supabase, e, username}: getUpdateProps) => {
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