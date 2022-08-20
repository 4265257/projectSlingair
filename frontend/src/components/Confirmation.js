import styled from "styled-components";
import tombstone from "../assets/tombstone.png";
import { useContext, useState, useEffect } from "react";
import { ResContext } from "./ResContext";

const Confirmation = () => {
  const { lastResOfArr } = useContext(ResContext);
    return (
    <Wrapper>
      <p>Confirmation page!</p>
      <br />
      <ResArea>
        Reservation #: {lastResOfArr.id}
        <br />
        Flight #: {lastResOfArr.flight}
        <br />
        Seat ID: {lastResOfArr.seat}
        <br />
        name: {lastResOfArr.givenName}
        <br />
        last name: {lastResOfArr.surname}
        <br />
        email: {lastResOfArr.email}
      </ResArea>
      <TombstonePic src={tombstone} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 2%;
  border: solid 2px black;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
`;
const ResArea = styled.div`
  font-family: "Courier New", Courier, monospace;
`;

const TombstonePic = styled.img`
  width: 200px;
`;
export default Confirmation;
