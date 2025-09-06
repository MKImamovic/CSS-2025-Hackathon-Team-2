import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import Countries from "../data/Countries"
import { Megaphone } from 'lucide-react';
import { Eye } from 'lucide-react';
import { Search } from 'lucide-react';
export default function MainPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [chargers, setChargers] = useState([]);
  const [selectedCharger, setSelectedCharger] = useState(null);

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
        <div className="absolute top-2 right-2 z-20 group">
          <button
            className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
            onClick={() => window.location.href = "https://www.gmail.com"}
          >
            <Megaphone className="w-6 h-6 text-green-700" />
          </button>

          <div className="hidden group-hover:block absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 p-4 space-y-2 transition-all">
            <ul className="space-y-1">
              <li>
                <a
                  href="mailto:malik.ahmetbegovic@gmail.com,MKImamovic@gmail.com"
                  target="_blank"
                  className="block text-gray-700 hover:text-green-700 hover:underline transition"
                >
                  ✉ Contact us via email
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/MKImamovic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-700 hover:text-blue-600 hover:underline transition"
                >
                  💻 Visit our GitHub 1
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Coderecorder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-700 hover:text-blue-600 hover:underline transition"
                >
                  💻 Visit our GitHub 2
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="absolute top-15 md:top-2.5 lg:top-3  left-1/2 transform -translate-x-1/2 z-10 w-[90%] sm:w-[70%] md:w-[50%]">
          <div className="flex items-center bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-2 pl-3 text-gray-500">
              <Search className="w-5 h-5" />
            </div>
            <input
              id="search"
              type="text"
              placeholder="Search a country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none p-2 text-sm sm:text-base"
            />
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
            <div className="flex flex-col">
              <div className="h-auto w-64 p-3 rounded-xl bg-white shadow-md">
                <h2 className="font-bold text-lg text-gray-800 mb-1">
                  {selectedCharger.AddressInfo.Title}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  {selectedCharger.AddressInfo.AddressLine1}
                </p>

                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">⚡ Power:</span>{" "}
                    {selectedCharger.Connections && selectedCharger.Connections.length > 0
                      ? Math.max(...selectedCharger.Connections.map(conn => conn.PowerKW || 0)) + " kW"
                      : "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">🔌 Quantity:</span>{" "}
                    {selectedCharger.Connections ? selectedCharger.Connections.length : "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">🔋 Type:</span>{" "}
                    {selectedCharger.Connections.length > 0 &&
                    selectedCharger.Connections[0].CurrentType
                      ? selectedCharger.Connections[0].CurrentType.Title
                      : "N/A"}
                  </p>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    className="flex-1 px-3 py-1.5 bg-[#8FA31E] text-white rounded-lg text-sm font-medium shadow hover:bg-[#6c8016] transition"
                    onClick={() => {
                      const lat = selectedCharger.AddressInfo.Latitude;
                      const lng = selectedCharger.AddressInfo.Longitude;
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
                        "_blank"
                      );
                    }}
                  >
                    🚗 Navigate
                  </button>
                  <button
                    className="flex-1 px-3 py-1.5 bg-[#3B82F6] text-white rounded-lg text-sm font-medium shadow hover:bg-[#2563EB] transition"
                    onClick={() => setShowReviews(!showReviews)}
                  >
                    {showReviews ? "🙈 Hide" : "💬 Reviews"}
                  </button>
                </div>
              </div>

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