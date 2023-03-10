import React from "react";

interface SideBar {
  contacts: Contact[];
  setContact: (value: React.SetStateAction<Contact | null>) => void;
}

export const SideBar = ({ contacts, setContact }: SideBar) => {
  return (
    <aside className="fixed top-0 bottom-0 lg:left-0 p-2 w-[200px] overflow-y-auto text-center bg-blue-900">
      <h1 className="font-bold text-white text-2xl mb-4">Chats:</h1>

      <div className="flex flex-col">
        {contacts.map((element) => {
          return (
            <div key={element.id}  onClick={() => setContact(element)}>

            <div
              className="bg-blue-400 rounded-full m-3 p-5 h-8 w-8 flex justify-center items-center cursor-pointer"
            >
              <h3 className="font-bold text-white">
                {element.name.substr(0, 1)}
              </h3>
            </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
