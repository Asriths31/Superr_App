import { useState } from 'react';
import { useNavigate } from 'react-router';
import { IoWarningOutline } from 'react-icons/io5';
import { IoCloseOutline } from 'react-icons/io5';

const CATEGORIES = [
  { id: 'Action', label: 'Action', color: '#FF5209', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&fit=crop&q=80' },
  { id: 'Drama', label: 'Drama', color: '#D7A4FF', image: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&fit=crop&q=80' },
  { id: 'Romance', label: 'Romance', color: '#11B800', image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&fit=crop&q=80' },
  { id: 'Thriller', label: 'Thriller', color: '#84C2FF', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&fit=crop&q=80' },
  { id: 'Western', label: 'Western', color: '#902500', image: 'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?w=400&fit=crop&q=80' },
  { id: 'Horror', label: 'Horror', color: '#7358FF', image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&fit=crop&q=80' },
  { id: 'Fantasy', label: 'Fantasy', color: '#FF4ADE', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&fit=crop&q=80' },
  { id: 'Music', label: 'Music', color: '#E61E32', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&fit=crop&q=80' },
  { id: 'Fiction', label: 'Fiction', color: '#6CD061', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&fit=crop&q=80' },
];

function CategorySelection() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [showError, setShowError] = useState(false);

  const handleCardClick = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
      if (selected.length + 1 >= 3) {
        setShowError(false);
      }
    }
  };

  const handleRemoveCategory = (id) => {
    setSelected(selected.filter((item) => item !== id));
  };

  const handleNextPage = () => {
    if (selected.length < 3) {
      setShowError(true);
      return;
    }
    localStorage.setItem('superapp_categories', JSON.stringify(selected));
    navigate('/dashboard');
  };

  return (
    <div className="w-screen min-h-screen bg-black text-white flex flex-col md:flex-row p-6 md:p-16 gap-8 select-none font-sans overflow-x-hidden">
      
      {/* Left Column: Selection Header and Capsules List */}
      <div className="w-full md:w-2/5 flex flex-col justify-between py-4">
        <div className="flex flex-col gap-6">
          <h1 className="text-5xl font-semibold font-logo text-[#72DB73] mb-2 tracking-wide">
            Super app
          </h1>
          <h2 className="text-4xl md:text-5xl font-black leading-tight max-w-sm">
            Choose your entertainment category
          </h2>

          {/* Selected Capsules Pills list */}
          <div className="flex flex-wrap gap-2.5 mt-6 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {selected.map((catId) => {
              const catObj = CATEGORIES.find((c) => c.id === catId);
              return (
                <div
                  key={catId}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-sm font-semibold select-none shadow-sm transition-all duration-200 hover:scale-[1.03]"
                  style={{ backgroundColor: '#148A08' }} // Custom Selected bg color
                >
                  <span>{catObj?.label}</span>
                  <button
                    onClick={() => handleRemoveCategory(catId)}
                    className="hover:bg-black/20 rounded-full p-0.5 transition-colors cursor-pointer text-white flex items-center justify-center"
                  >
                    <IoCloseOutline className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error and Info warning alerts */}
        <div className="mt-8 flex flex-col gap-4">
          {showError && (
            <div className="flex items-center gap-2 text-red-500 font-medium text-sm animate-pulse">
              <IoWarningOutline className="w-5 h-5" />
              <span>Minimum 3 category required</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Interactive Category Cards Grid */}
      <div className="w-full md:w-3/5 flex flex-col justify-between gap-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {CATEGORIES.map((category) => {
            const isSelected = selected.includes(category.id);
            return (
              <div
                key={category.id}
                onClick={() => handleCardClick(category.id)}
                className={`aspect-[5/4] rounded-xl p-4 flex flex-col justify-between relative overflow-hidden cursor-pointer select-none transition-all duration-300 transform shadow-md hover:scale-[1.03] active:scale-95 border-4 ${
                  isSelected ? 'border-[#72DB73]' : 'border-transparent'
                }`}
                style={{ backgroundColor: category.color }}
              >
                <span className="text-xl font-bold text-white relative z-10 drop-shadow-sm select-none">
                  {category.label}
                </span>
                
                {/* Background movie still image preview */}
                <div className="w-full h-[65%] mt-2 rounded-lg overflow-hidden relative shadow-inner">
                  <img
                    src={category.image}
                    alt={category.label}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Next page navigation trigger button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleNextPage}
            className="px-8 py-2.5 rounded-full bg-[#72DB73] text-black font-bold text-base hover:bg-[#5ec45f] active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-lg"
          >
            Next Page
          </button>
        </div>
      </div>

    </div>
  );
}

export default CategorySelection;
