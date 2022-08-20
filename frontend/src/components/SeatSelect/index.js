import SeatSelect from "./SeatSelect";
import styled from "styled-components";
import { useEffect, useState } from "react";

const Homepage = ({}) => {
  const [flight, setFlight] = useState();
  const [flights, setFlights] = useState([]); 
  useEffect(() => {
    // TODO: get seating data for selected flight
      fetch(`/api/get-flights`)
      .then((res) => res.json())
      .then((parsed) => setFlights(parsed.data));
  }, []);
  return (
    <div>
      <FlightSelection>
        Select Flight :
        <select
          name="Flight"
          id="flight"
          onChange={(e) => {
            return setFlight(e.target.value);
          }}
        >
          <option>Select Flight</option>
          {flights.map(singleFlight =>{
           return <option key={singleFlight.flightNum} value={singleFlight.flightNum}>{singleFlight.flightNum}</option>
          })
          }
        </select>
      </FlightSelection>
      <SeatSelect flight={flight}></SeatSelect>
    </div>
  );
};
const FlightSelection = styled.div`
  background: var(--color-cadmium-red);
  padding-top: 10px;
  padding-bottom: 10px;
`;

export default Homepage;
