import React from 'react';

interface NameForm {
    updateProfile: (e: React.SyntheticEvent) => Promise<void>
    username: string | null
    setUsername: (value: React.SetStateAction<string | null>) => void
    loading: boolean
}

export const NameForm = ({updateProfile, username, setUsername, loading}: NameForm) => {
    return (
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
              Set username
            </button>                
        </form>
    );
};

