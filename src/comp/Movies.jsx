import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useMovies, useMovieDetails } from '../api/hooks';
import { IoCloseOutline, IoStar } from 'react-icons/io5';
import profileLogo from '../assets/profileLogo.png';

function Movies() {
  const navigate = useNavigate();

  const categories = JSON.parse(localStorage.getItem('superapp_categories') || '[]');
  const { moviesByGenre, loading, error } = useMovies(categories);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const handleSignOut = () => {
    localStorage.removeItem('superapp_user');
    localStorage.removeItem('superapp_categories');
    navigate('/register');
  };

  return (
    <div className="w-screen min-h-screen bg-black text-white p-6 md:p-12 font-sans overflow-x-hidden">
      <header className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
        <h1 
          onClick={() => navigate('/dashboard')}
          className="text-4xl font-semibold font-logo text-[#72DB73] tracking-wide cursor-pointer hover:opacity-90 active:scale-95 transition-all duration-150"
        >
          Super app
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSignOut}
            className="text-[10px] uppercase bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/80 border border-white/10 rounded-full px-3.5 py-1.5 font-bold transition-all duration-150 active:scale-95 cursor-pointer"
          >
            Sign Out
          </button>
          <div 
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 md:w-11 md:h-11 rounded-full border-2 border-[#72DB73] bg-white/10 overflow-hidden flex items-center justify-center cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all duration-150"
            title="Back to Dashboard"
          >
            <img
              src={profileLogo}
              alt="Profile Avatar"
              className="w-full h-full object-cover scale-[1.1]"
            />
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-10">
        <h2 className="text-xl md:text-2xl text-gray-400 font-medium tracking-wide">
          Entertainment Discovery Directory
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-20 flex-grow w-full">
            <div className="w-12 h-12 rounded-full border-4 border-t-[#72DB73] border-white/20 animate-spin" />
          </div>
        ) : error && Object.keys(moviesByGenre).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
            <p className="text-red-400 font-medium">Failed to retrieve movie suggestions</p>
            <p className="text-xs text-gray-500">Please check your network connection or verify API keys.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {categories.map((category) => {
              const list = moviesByGenre[category] || [];
              return (
                <div key={category} className="flex flex-col gap-4">
                  <h3 className="text-2xl font-black text-white tracking-wide border-l-4 border-[#72DB73] pl-3">
                    {category}
                  </h3>

                  {list.length === 0 ? (
                    <p className="text-sm text-gray-500 font-medium italic py-4">
                      No movies available for this category.
                    </p>
                  ) : (
                    <div className="flex overflow-x-auto gap-6 pb-4 custom-scrollbar scroll-smooth">
                      {list.map((movie) => (
                        <div
                          key={movie.imdbID}
                          onClick={() => setSelectedMovieId(movie.imdbID)}
                          className="aspect-[2/3] w-[140px] sm:w-[180px] md:w-[220px] flex-shrink-0 rounded-xl overflow-hidden cursor-pointer bg-[#101010] border border-white/5 relative group transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl hover:border-[#72DB73]/40 active:scale-98 shadow-md"
                        >
                          <img
                            src={movie.Poster}
                            alt={movie.Title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pointer-events-none">
                            <div className="text-white">
                              <p className="font-bold text-sm tracking-wide leading-snug">{movie.Title}</p>
                              <p className="text-[10px] text-gray-300 mt-0.5">{movie.Year}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {selectedMovieId && (
        <MovieModal movieId={selectedMovieId} onClose={() => setSelectedMovieId(null)} />
      )}
    </div>
  );
}

function MovieModal({ movieId, onClose }) {
  const { details, loading } = useMovieDetails(movieId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#121212] border border-[#2d2d2d] rounded-2xl p-6 shadow-2xl relative flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors cursor-pointer z-20 flex items-center justify-center"
        >
          <IoCloseOutline className="w-6 h-6" />
        </button>

        {loading || !details ? (
          <div className="flex items-center justify-center w-full min-h-[300px] flex-grow">
            <div className="w-10 h-10 rounded-full border-4 border-t-[#72DB73] border-white/20 animate-spin" />
          </div>
        ) : (
          <>
            <div className="w-full md:w-2/5 aspect-[2/3] rounded-xl overflow-hidden border border-[#2a2a2a] relative shadow-md bg-black">
              <img
                src={details.Poster}
                alt={details.Title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full md:w-3/5 flex flex-col justify-between py-2 text-white">
              <div className="flex flex-col gap-3">
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-wide leading-tight text-[#72DB73] pr-6">
                  {details.Title}
                </h3>
                
                <div className="flex flex-wrap gap-2 mt-1">
                  {details.Genre?.split(',').map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300"
                    >
                      {g.trim()}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-5 text-sm text-gray-400 font-semibold mt-2">
                  <div className="flex items-center gap-1.5 text-yellow-500">
                    <IoStar />
                    <span>{details.imdbRating || '8.0'}/10</span>
                  </div>
                  <span>{details.Released || '2023'}</span>
                </div>

                <div className="mt-4 flex flex-col gap-1.5 select-text">
                  <p className="text-xs uppercase text-gray-500 font-bold tracking-widest">Synopsis</p>
                  <p className="text-sm text-gray-300 leading-relaxed font-medium">
                    {details.Plot}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 h-9 rounded-full bg-[#72DB73] text-black font-bold hover:bg-[#5ec45f] active:scale-95 transition-all duration-150 cursor-pointer text-sm shadow-md"
                >
                  Close details
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Movies;
