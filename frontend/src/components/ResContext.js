import { createContext, useState, useEffect } from "react";

export const ResContext = createContext(null);
export const ResProvider = ({ children }) => {
  const [reservations, setReservations] = useState({});
  const [getName, setGetName] = useState("");
  const [getLastName, setGetLastName] = useState("");
  const [getEmail, setGetEmail] = useState("");
  const [getFlight, setGetFlight] = useState("");
  const [getSeatNum, setGetSeatNum] = useState("");
  
  useEffect(() => {
    // TODO: get res data for resID
    fetch(`/api/get-reservations`)
    .then((res) => res.json())
    .then((data) => {
      setReservations(data);
    });
  }, [reservations]);
  if (!reservations.data) {
    return null;
  }
  let arrOfRes = reservations?.data;
  let lastResOfArr = arrOfRes[arrOfRes?.length - 1];
  
  return (
    <ResContext.Provider
    value={{
      lastResOfArr,
      getLastName,
      setGetLastName,
      getEmail,
      setGetEmail,
      getFlight,
      setGetFlight,
      getSeatNum,
      setGetSeatNum,
      getName,
      setGetName,
    }}
    >
      {children}
    </ResContext.Provider>
  );
};
