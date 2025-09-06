import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import Countries from "../data/Countries"
import { Megaphone } from 'lucide-react';
export default function MainPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [chargers, setChargers] = useState([]);
  const [selectedCharger, setSelectedCharger] = useState(null);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const results = Countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(results);

      if (results.length === 1) {
        const code = results[0].code;
       
        fetch(`https://api.openchargemap.io/v3/poi/?output=json&countrycode=${code}&maxresults=10&key=f4633e6c-f1d0-4b8d-8345-b65c26f9a6af`)
          .then(res => res.json())
          .then(data => setChargers(data))
          .catch(err => console.error(err));
      } else {
        setChargers([]);
      }
    } else {
      setFilteredCountries([]);
      setChargers([]);
    }
  }, [searchTerm]);

  const containerStyle = {
    width: '100vw',
    height: '100vh'
  };

  const defaultCenter = {
    lat: 45.815399,
    lng: 15.966568
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCp77wvyFv-bOuCamN78fvonoCEXQCc5_8'
  });

  const [center, setCenter] = useState(defaultCenter);
  const [showUserInfo, setUserShowInfo] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {}
      );
    }
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
  <>
        <div className ="pr-13 pt-1 flex absolute bg-transparent z-10 top-0 right-0 m-2 rounded-full group ">
          <button className="bg-transparent text-black text-xl " onClick={() => window.location.href= "https://www.gmail.com"}>
          <Megaphone className="h-10 w-10 text-black " />
          </button>
          <div className="hidden group-hover:block">
            <ul>
              <li><a href="mailto:malik.ahmetbegovic@gmail.com,MKImamovic@gmail.com"
                     target="_blank"
                     >Contact us over mail!</a></li>
              <li><a 
                      href="https://github.com/MKImamovic"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-black hover:underline">Visit our GitHub1</a></li>
                      <li><a href="https://github.com/Coderecorder"
                             target="_blank"
                             rel="noopener noreferrer"
                             className="text-gray-800 hover:text-black hover:underline">Visit our GitHub2</a></li>
            </ul>
          </div>
        </div>
        <div className="flex justify-center p-0.5 bg-transparent m-1 absolute z-10 left-1/2 transform -translate-x-1/2">
          <input className="bg-white text-black border-black-1 rounded-xl m-2 p-1"
          id="search"
            type= "text"
            placeholder = "Search a country..."
            value = {searchTerm}
            onChange = {(e) => setSearchTerm(e.target.value)}
        />
        </div>
      

    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
    >
      <Marker
        position={center}
        onClick={() => setUserShowInfo(true)}
      />
      {showUserInfo && (
        <InfoWindow
          position={center}
          onCloseClick={() => setUserShowInfo(false)}
        >
          <div className='p-2 w-50'>
            <h2 className='text-xl'>Your Location</h2>
          </div>
        </InfoWindow>
      )}

        
        {chargers.map((charger) => (
          <Marker
            key={charger.ID}
            position={{
              lat: charger.AddressInfo.Latitude,
              lng: charger.AddressInfo.Longitude
            }}
            onClick={() => setSelectedCharger(charger)}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
              scaledSize: { width: 40, height: 40 }
            }}
          />
        ))}
        
        {selectedCharger && (
          <InfoWindow
            position={{
              lat: selectedCharger.AddressInfo.Latitude,
              lng: selectedCharger.AddressInfo.Longitude
            }}
            onCloseClick={() => setSelectedCharger(null)}
          >
            <div className='h-auto w-40'>
              <h2 className='font-bold text-xl'>{selectedCharger.AddressInfo.Title}</h2>
              <p>{selectedCharger.AddressInfo.AddressLine1}</p>
              <p>Power: {
            selectedCharger.Connections && selectedCharger.Connections.length > 0
            ? Math.max(...selectedCharger.Connections.map(conn => conn.PowerKW || 0)) + ' kW'
            : 'N/A'
            }</p>
            <p>
                Quantity: {
                selectedCharger.Connections
                    ? selectedCharger.Connections.length
                    : 'N/A'
                }
            </p>
            <p>
            Type: {
                selectedCharger.Connections.length > 0 && selectedCharger.Connections[0].CurrentType
                ? selectedCharger.Connections[0].CurrentType.Title
                : "N/A"
            }
            </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </>
  );
}