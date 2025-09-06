import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import Countries from "../data/Countries"
import { Megaphone } from 'lucide-react';
export default function MainPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [chargers, setChargers] = useState([]);
  const [selectedCharger, setSelectedCharger] = useState(null);

  // Review modal state
  const [showReviews, setShowReviews] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);

  const containerStyle = {
    width: '100vw',
    height: '100vh'
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCp77wvyFv-bOuCamN78fvonoCEXQCc5_8'
  });

  const [center, setCenter] = useState(null);
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
        () => {
          setCenter(null); 
        }
      );
    }
  }, []);

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

  useEffect(() => {
    if (selectedCharger) {
      const key = `reviews_${selectedCharger.ID}`;
      const stored = localStorage.getItem(key);
      setReviews(stored ? JSON.parse(stored) : []);
    }
  }, [selectedCharger, showReviews]);

  const handleAddReview = () => {
    if (!reviewText.trim()) return;
    const key = `reviews_${selectedCharger.ID}`;
    const newReviews = [...reviews, reviewText.trim()];
    localStorage.setItem(key, JSON.stringify(newReviews));
    setReviews(newReviews);
    setReviewText("");
  };

  if (!isLoaded || center === null) {
    return <div className="flex justify-center items-center h-screen">Awaiting your location...</div>;
  }

  return (
  <>
        <div className ="pr-2 pl-auto absolute">
          <Megaphone className="h-2 w-2 text-white"></Megaphone>
        </div>
        <div className="flex justify-center p-0.5 bg-transparent m-1 absolute z-10 left-1/2 transform -translate-x-1/2">
          <input className="bg-white text-black border-black-1 rounded-xl m-2 p-1"
          id="search"
          type="text"
          placeholder="Search a country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
            onClick={() => {
              setSelectedCharger(charger);
              setShowReviews(false);
            }}
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
            onCloseClick={() => {
              setSelectedCharger(null);
              setShowReviews(false);
            }}
          >
            <div className='h-auto w-52'>
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
              <button
                className="mt-2 px-3 py-1 bg-[#8FA31E] text-white rounded hover:bg-[#6c8016] transition"
                onClick={() => {
                  const lat = selectedCharger.AddressInfo.Latitude;
                  const lng = selectedCharger.AddressInfo.Longitude;
                  window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
                }}
              >
                Navigate
              </button>
              <button
                className="mt-2 ml-2 px-3 py-1 bg-[#3B82F6] text-white rounded hover:bg-[#2563EB] transition"
                onClick={() => setShowReviews(!showReviews)}
              >
                {showReviews ? "Hide Reviews" : "Reviews"}
              </button>
              {showReviews && (
                <div className="mt-2 bg-white rounded p-2 shadow text-black">
                  <h3 className="font-semibold mb-1">Reviews</h3>
                  {reviews.length === 0 && <p className="text-sm">No reviews yet.</p>}
                  <ul className="mb-2 max-h-24 overflow-y-auto">
                    {reviews.map((r, i) => (
                      <li key={i} className="text-sm border-b last:border-b-0 py-1">{r}</li>
                    ))}
                  </ul>
                  <textarea
                    className="w-full border rounded p-1 text-sm mb-1"
                    rows={2}
                    placeholder="Write a review..."
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                  />
                  <button
                    className="w-full bg-[#8FA31E] text-white rounded py-1 mt-1 hover:bg-[#6c8016] transition"
                    onClick={handleAddReview}
                  >
                    Submit Review
                  </button>
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </>
  );
}