import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const defaultCenter = {
  lat: 45.815399,
  lng: 15.966568
};

export default function MainPage() {
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
  );
}