import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const center = {
  lat: 45.815399, 
  lng: 15.966568  
};

export default function MainPage() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCp77wvyFv-bOuCamN78fvonoCEXQCc5_8' 
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
    >
     
    </GoogleMap>
  );
};