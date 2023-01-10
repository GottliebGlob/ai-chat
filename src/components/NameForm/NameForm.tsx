import React from 'react';

interface NameForm {
    updateProfile: (e: React.SyntheticEvent) => Promise<void>
    user: User | null
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    loading: boolean
}

export const NameForm = ({updateProfile, user, setUser, loading}: NameForm) => {

const usernameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (user) {
    setUser({...user, name: e.target.value})
  }
}

    return (
        <form onSubmit={updateProfile} className="flex justify-center items-center flex-col">
          <div >
            <label htmlFor="username" className="font-bold text-xl m-2 text-blue-800">Name</label>
            <input
              id="username"
              type="text"
              value={user?.name || ''}
              className="p-2 rounded-md font-bold"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => usernameHandler(e)}
            />
          </div>
       
          
          <button className="bg-blue-500 rounded-md p-2 font-bold m-4 text-white" disabled={loading}>
              Set username
            </button>                
        </form>
    );
};

