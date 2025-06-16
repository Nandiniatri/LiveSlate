// context/UserContext.js
import { createContext, useContext, useState } from "react";
import { useParams } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ username: "Anonymous" });
  const { roomID } = useParams();

  return (
    <UserContext.Provider value={{ user, setUser , roomID}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
