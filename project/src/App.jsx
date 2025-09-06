import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/main');
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gradient-to-br from-[#556B2F] to-[#FAEDCE]">
      
      
      <div className="flex flex-col items-center md:items-start justify-center md:w-1/2 px-8 md:pl-20">
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-[#FAEDCE] drop-shadow-lg">
          VoltMap
        </h1>
        <span className="mt-4 text-lg sm:text-xl md:text-2xl text-[#FAEDCE] font-medium drop-shadow-sm">
          The cure for your range anxiety
        </span>

        <button
          className="mt-10 md:mt-20 px-8 py-4 bg-[#CCD5AE] text-xl rounded-3xl shadow-lg hover:bg-[#E0E5B6] transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          onClick={handleClick}
        >
          Discover chargers around you
        </button>
      </div>

      
      <div className="flex flex-col items-center justify-center md:w-1/2 p-6 md:p-16 lg:p-32">
        <p className="text-center md:text-left text-[#3B3B3B] text-sm sm:text-base md:text-lg leading-relaxed bg-opacity-50 p-6 rounded-2xl">
          Our web app is designed to make electric driving simpler, smarter, and more reliable. With an intuitive interface and interactive maps, you can instantly search and discover all available charging stations around you, no matter where you are. Whether you’re planning a long trip or just need a quick top-up nearby, the app helps you find chargers with real-time details on location, availability, power, and connection types. Say goodbye to range anxiety — drive with confidence knowing you’ll always have a clear path to your next charge, anytime and anywhere you need it.
        </p>
      </div>

    </div>
  );
}

export default App;
