import { useLocation, useNavigate } from 'react-router-dom';

function App() {
const navigate = useNavigate();
  const handleClick = () => {
    navigate('/main');
  };
  return (
    <>
      <div className="block md:flex h-screen w-screen bg-gradient-to-br from-[#556B2F] to-[#FAEDCE]">
        <div className="flex flex-col items-center md:w-1/2 md:pl-20">
          <h1 className="text-8xl mt-15 text-[#FAEDCE]">VoltMap</h1>
          <span className='mt-5 text-[#FAEDCE]'>The cure for your range anxiety</span>
          
            <button className="bg-[#CCD5AE] text-xl rounded w-80 mt-40 h-20 hover:bg-[#E0E5B6] transition duration-200 ease-in-out cursor-pointer rounded-2xl hover:-translate-y-1"
          onClick={handleClick}>Discover chargers around you
          </button>
          
        </div>
        <div className='flex flex-col items-center justify-center md:w-1/2 p-10 md:p-30'>
          <p className='mt-10 text-center text-[#556B2F]'>
          Our web app is designed to make electric driving simpler, smarter, and more reliable. With an intuitive interface and interactive maps, you can instantly search and discover all available charging stations around you, no matter where you are. Whether you’re planning a long trip or just need a quick top-up nearby, the app helps you find chargers with real-time details on location, availability, power, and connection types. Say goodbye to range anxiety — drive with confidence knowing you’ll always have a clear path to your next charge, anytime and anywhere you need it
          </p>
        </div>
      </div>
    </>
  )
}

export default App