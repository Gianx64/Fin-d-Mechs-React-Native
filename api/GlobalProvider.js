import React, { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser } from "./apiUsers";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await getCurrentUser()
      if (response) {
        setIsLogged(true);
        setUser(response);
      } else {
        setIsLogged(false);
        setUser(null);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        setLoading
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
