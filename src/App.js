import React, { useState } from "react";
import Map from "./mapComponent/Map";
import "./mapComponent/map.css";

function App() {
  let [location, setLocation] = useState([0, 0]);
  return (
    <Map setGeoLocation={setLocation}>
      <div className="location">
        {"Latitute: " + location.lat}
        <br />
        {"Longitude: " + location.lng}
      </div>
    </Map>
  );
}

export default App;
