import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerImg from "./images/icon-location.svg";
import arrow from "./images/icon-arrow.svg";
import "./index.css";

function App() {
  const [data, setData] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // fetchData("");
  }, []);

  const fetchData = async (ipAddress) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_jV2td80d6ABD9qR5Ohp89jAn5hsBa&ipAddress=${ipAddress}`
      );
      const data = await response.json();
      console.log(data);
      const ip = data.ip;
      const location = `${data.location.country} ${data.location.region}`;
      const timeZone = `UTC ${data.location.timezone}`;
      const isp = data.isp;
      const lng = data.location.lng;
      const lat = data.location.lat;
      console.log(ip, location, timeZone, isp, lng, lat);
      setData({ ip, location, timeZone, isp, lng, lat });
    } catch (error) {
      console.log(error);
      if (error.message === "Failed to fetch") {
        setError("Unable to connect to Map. Check your Network");
      } else {
        setError("Something Went wrong");
      }
    }
    setLoading(false);
  };

  const customIcon = L.icon({
    iconUrl: markerImg,
    iconSize: [38, 50],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
  });

  const Map = () => {
    return (
      <MapContainer
        center={[data.lat, data.lng]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100vh", zIndex: "0" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker icon={customIcon} position={[data.lat, data.lng]}>
          <Popup>{data.location}.</Popup>
        </Marker>
      </MapContainer>
    );
  };

  return (
    <div className="h-[100vh]">
      <header className="flex flex-col items-center justify-center gap-5 p-10 pb-32">
        <h1 className="text-xl text-white">IP Address Tracker</h1>
        <div className=" flex w-9/12 items-center justify-center ">
          <input
            className="h-10 w-full rounded-l-lg px-3 text-xs outline-none md:w-96 md:text-[18px]"
            placeholder="Search for any IP address or domain"
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          <div
            onClick={fetchData.bind(this, inputValue)}
            className="flex h-10 w-10  cursor-pointer items-center justify-center rounded-r-lg bg-black"
          >
            <img src={arrow} alt="arrow" />
          </div>
        </div>

        <div className="absolute top-20 z-10 flex w-9/12 translate-y-[5rem] flex-col items-center justify-between rounded-lg bg-white py-5 px-10 md:flex-row">
          <div className="flex md:text-left flex-col text-center md:w-1/4 md:border-r	">
            <p className="m-2 md:m-4 text-xs text-dark-grey">IP ADDRESS</p>
            <h1 className="font-bold text-very-dark-grey">{data.ip}</h1>
          </div>

          <div className="flex md:text-left flex-col pl-2 text-center md:w-1/4 md:border-r	">
            <p className="m-2 md:m-4 text-xs text-dark-grey">LOCATION</p>
            <h1 className="font-bold text-very-dark-grey">{data.location}</h1>
          </div>

          <div className="flex flex-col md:text-left pl-2 text-center md:w-1/4	md:border-r">
            <p className="m-2 md:m-4 text-xs text-dark-grey">TIMEZONE</p>
            <h1 className="font-bold text-very-dark-grey">{data.timeZone}</h1>
          </div>

          <div className="flex flex-col pl-2 text-center md:w-1/4 md:text-left	">
            <p className="m-2 md:m-4 text-xs text-dark-grey">ISP</p>
            <h1 className="font-bold text-very-dark-grey">{data.isp}</h1>
          </div>
        </div>
      </header>

      <main className="h-full">
        {data.lat && data.lng && !loading ? (
          <Map />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-300">
            {!data.lat && !data.lng && !loading && !error && (
              <h1 className="text-center text-3xl text-white">MAP</h1>
            )}
            {loading && (
              <h1 className="text-center text-3xl text-green-400">
                Loading...
              </h1>
            )}
            {error && !loading && (
              <h1 className="text-center text-3xl text-red-500">{error}</h1>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
