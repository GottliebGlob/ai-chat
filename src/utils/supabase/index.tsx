import { SupabaseClient } from '@supabase/supabase-js';
import { Session } from "@supabase/gotrue-js/src/lib/types"

interface getData {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    session: Session
    supabase: SupabaseClient<any, "public", any>
}


interface getProfileProps extends getData {
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}

export const getProfile = async ({setLoading, setUser, session, supabase}: getProfileProps) => {
    try {
      setLoading(true);
      const { user } = session;

      let { data, error, status } = await supabase
        .from("users")
        .select(`username, id`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUser({id: data.id, name: data.username});
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  interface getClientProps extends getData {
    setContacts: React.Dispatch<React.SetStateAction<Contact[]>> }

  export const getContacts = async ({setLoading, setContacts, session, supabase}: getClientProps) => {
    try {
      setLoading(true);
      const { user } = session;

      let { data, error, status } = await supabase
        .from("users_chat")
        .select("users (username, id), chat_id")
        .neq("user_id", user.id);

      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        let decomposed: Contact[] = data.map((x: any) => {
          return {
            name: x.users.username,
            id: x.users.id,
            chat_id: x.chat_id
          };
        });

        setContacts([...decomposed]);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  interface getUpdateProps extends getData {
    e: React.SyntheticEvent 
    user: User | null
}

 export const updateProfile = async ({setLoading, session, supabase, e, user}: getUpdateProps) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { user } = session;

      const updates = {
        id: user.id,
        user,
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

  interface subscriptionProps {
    supabase: SupabaseClient<any, "public", any>
    activeContact: Contact | null
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  }


  export const messageSubscription = ({supabase, activeContact, setMessages}: subscriptionProps) => {
    const profiles = supabase
    .channel("custom-insert-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "messages",
        filter: `chat_id=eq.${activeContact?.chat_id}`,
      },
      (payload: any) => {
          setMessages(messages => messages.map(item => {
            if (item.id === payload.new.id) {
              return {...payload.new}
            }
            return item
        }))
      }
    )
    .subscribe();
  return () => {
    profiles.unsubscribe();
  };
  }

  interface getMessageProps extends getData {
    activeContact: Contact,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    messages: Message[]
}   

  export const getMessages = async ({setLoading, setMessages, messages, supabase, activeContact}: getMessageProps) => {
    try {
      setLoading(true);
    
      let { data, error, status } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", activeContact?.chat_id)

      if (error && status !== 406) {
        throw error;
      }
      if (data) {

        let decomposed: Message[] = data.map((x: any) => {
          return {
            id: x.id,
            content: x.content,
            user_from: x.user_from,
            chat_id: x.chat_id,
            created_at: new Date(x.created_at)
          };
        });

        setMessages([...decomposed]);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };