import React, { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser, getAppointments } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLogged(true);
          setUser(res);
        } else {
          setIsLogged(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        if (isLogged && user) {
          console.log("Trying to get appointments for: "+user.email);
          getAppointments(user)
            .then((gotAppointments) => {
              if (gotAppointments) {
                setAppointments(gotAppointments);
              } else {
                setAppointments([]);
              }
            })
            .catch((error) => {
              console.log(error);
            })
            .finally(() => {
              setLoading(false);
            });
        } else {
          setAppointments([]);
          setLoading(false);
        }
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        appointments,
        setAppointments,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
