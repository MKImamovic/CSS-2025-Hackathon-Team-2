import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import Countries  from "../data/Countries"
export default function MainPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [searchCode , setSearchCode] = useState ("");
    useEffect(() => {
      if (searchTerm.length > 0){
      const results = Countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(results);

      console.log(results);
      if (searchTerm.length > 0) {
        console.log(results);
        if (results.length === 1) {
            setSearchCode(results[0].code);
            console.log(searchCode);
            const apiMod = (`https://api.openchargemap.io/v3/poi/?output=json&countrycode=${searchCode}&maxresults=10?key=f4633e6c-f1d0-4b8d-8345-b65c26f9a6af`)
            console.log(apiMod);
          }
      }
    } else {
      setFilteredCountries([]);
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
  const [showChargerInfo, setChargerShowInfo] = useState(false);

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
    <div className="bg-[#FAEDCE]">
     <div className="bg-[#FEFAE0] min-h-20px flex justify-center">
      <input
      id="search"
         type= "text"
         placeholder = "Search a country..."
         value = {searchTerm}
         onChange = {(e) => setSearchTerm(e.target.value)}
     />
     <div className = "p-4">
      <p>{filteredCountries.length} results found</p>
      <ul>
        {filteredCountries.map(country => (
          <li key={country.code}>{country.name}</li>
        ))}
      </ul>
      </div>
   </div>

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

    </GoogleMap>
  </>
);
}