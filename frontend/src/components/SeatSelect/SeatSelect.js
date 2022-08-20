import Plane from "./Plane";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { ResContext } from "../ResContext";

const SeatSelect = ({ flight }) => {
  const {
    lastResOfArr,
    setGetName,
    setGetLastName,
    setGetEmail,
    setGetFlight,
    setGetSeatNum,
  } = useContext(ResContext);
  let history = useHistory();
  const [inputName, setInputName] = useState("");
  const [inputLastName, setInputLastName] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputSeat, setInputSeat] = useState("");

  const pull_SeatNum = (seatNum) => {
    setInputSeat(seatNum);
  };

  const handleClick = async (
    inputName,
    inputLastName,
    inputEmail,
    inputSeat
  ) => {
    if (inputName && inputLastName && inputEmail) {
      await fetch("/api/add-reservation", {
        method: "POST",
        body: JSON.stringify({
          flight: flight,
          seat: inputSeat,
          givenName: inputName,
          surname: inputLastName,
          email: inputEmail,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("Id", lastResOfArr.id);
          setGetName(lastResOfArr.givenName);
          setGetLastName(lastResOfArr.surname);
          setGetEmail(lastResOfArr.email);
          setGetFlight(lastResOfArr.flight);
          setGetSeatNum(lastResOfArr.seat);
          history.push("/confirmed");
        });
    }
  };
  return (
    <div>
      <h2>Select your seat and Provide your information!</h2>
      <SeatUserSection>
        <Plane flight={flight} funcPullSeat={pull_SeatNum}></Plane>
        <UserSection>
          <input
            type="text"
            id="firstName"
            value={inputName}
            onChange={(e) => {
              setInputName(e.target.value);
            }}
            required
          ></input>
          <input
            type="text"
            id="lastName"
            value={inputLastName}
            onChange={(e) => {
              setInputLastName(e.target.value);
            }}
            required
          ></input>
          <input
            type="email"
            id="email"
            value={inputEmail}
            onChange={(e) => {
              setInputEmail(e.target.value);
            }}
            required
          ></input>
          <ConfirmButton
            onClick={() => {
              handleClick(inputName, inputLastName, inputEmail, inputSeat);
            }}
          >
            Confirm
          </ConfirmButton>
        </UserSection>
      </SeatUserSection>
    </div>
  );
};
const SeatUserSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const UserSection = styled.div`
  display: flex;
  width: 350px;
  flex-direction: column;
  border: solid;
  border-radius: 5px;
  padding: var(--padding-page) 18px;
`;
const ConfirmButton = styled.button`
  margin-top: 10px;
  background: var(--color-alabama-crimson);
  height: 40px;
  border: 0ch;
  border-radius: 5px;
  font-size: 20px;
`;
export default SeatSelect;
