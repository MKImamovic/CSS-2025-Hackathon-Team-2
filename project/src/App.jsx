import { useLocation, useNavigate } from 'react-router-dom';

function App() {
const navigate = useNavigate();
  const handleClick = () => {
    navigate('/main');
  };
  return (
    <>
      <div className="flex items-center justify-center h-screen w-screen bg-[#FAEDCE]">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-7xl mb-8 text-[#8FA31E]">VoltMap</h1>
          <button className="bg-[#E0E5B6] px-6 py-2 rounded w-100 h-20 hover:bg-[#CCD5AE] transition duration-200 ease-in-out cursor-pointer"
          onClick={handleClick}>Discover chargers around you</button>
        </div>
      </div>
    </>
  )
}

export default App