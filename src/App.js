import { useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState("");
  const fetchData = async (ipAddress) => {
    const response = await fetch(
      `https://geo.ipify.org/api/v2/country?apiKey=at_jV2td80d6ABD9qR5Ohp89jAn5hsBa&ipAddress=${ipAddress}`
    );
    const data = await response.json();
    const ip = data.ip;
    const location = `${data.location.country} ${data.location.region}`;
    const timeZone = `UTC ${data.location.timezone}`;
    const isp = data.isp;
    console.log(ip, location, timeZone, isp);
    setData(`${ip}, ${location}, ${timeZone}, ${isp}`);
  };

  fetchData("197.210.226.251");
  return (
    <div className="App">
      <h1>{data}</h1>
    </div>
  );
}

export default App;
