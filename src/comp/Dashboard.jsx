import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useWeather, useNews } from '../api/hooks';
import profileLogo from '../assets/profileLogo.png';
import {
  IoChevronUpOutline,
  IoChevronDownOutline,
  IoTimeOutline,
  IoCreateOutline,
  IoCloseOutline
} from 'react-icons/io5';
import {
  WiBarometer,
  WiWindy,
  WiHumidity,
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiFog
} from 'react-icons/wi';

const getWeatherIconComponent = (condition) => {
  const cond = (condition || '').toLowerCase();
  if (cond.includes('sun') || cond.includes('clear')) return <WiDaySunny className="w-12 h-12 text-white" />;
  if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower')) return <WiRain className="w-12 h-12 text-white" />;
  if (cond.includes('thunder') || cond.includes('storm')) return <WiThunderstorm className="w-12 h-12 text-white" />;
  if (cond.includes('snow') || cond.includes('ice')) return <WiSnow className="w-12 h-12 text-white" />;
  if (cond.includes('fog') || cond.includes('mist') || cond.includes('haze')) return <WiFog className="w-12 h-12 text-white" />;
  return <WiCloudy className="w-12 h-12 text-white" />;
};

const ALL_CATEGORIES = [
  { id: 'Action', label: 'Action', color: '#FF5209' },
  { id: 'Drama', label: 'Drama', color: '#D7A4FF' },
  { id: 'Romance', label: 'Romance', color: '#11B800' },
  { id: 'Thriller', label: 'Thriller', color: '#84C2FF' },
  { id: 'Western', label: 'Western', color: '#902500' },
  { id: 'Horror', label: 'Horror', color: '#7358FF' },
  { id: 'Fantasy', label: 'Fantasy', color: '#FF4ADE' },
  { id: 'Music', label: 'Music', color: '#E61E32' },
  { id: 'Fiction', label: 'Fiction', color: '#6CD061' },
];

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('superapp_user') || '{}');
  const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem('superapp_categories') || '[]'));
  const [showCatEditor, setShowCatEditor] = useState(false);
  const [editingCats, setEditingCats] = useState([]);

  const openCatEditor = () => {
    setEditingCats([...categories]);
    setShowCatEditor(true);
  };

  const toggleEditCat = (id) => {
    setEditingCats((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  };

  const saveCatEdits = () => {
    if (editingCats.length < 3) return;
    localStorage.setItem('superapp_categories', JSON.stringify(editingCats));
    setCategories(editingCats);
    setShowCatEditor(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('superapp_user');
    localStorage.removeItem('superapp_categories');
    navigate('/register');
  };

  const [notes, setNotes] = useState(() => localStorage.getItem('superapp_notes') || '');
  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    localStorage.setItem('superapp_notes', e.target.value);
  };

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = (currentTime.getMonth() + 1) + '-' + currentTime.getDate() + '-' + currentTime.getFullYear();
  const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const { weather, loading: weatherLoading } = useWeather();
  const { activeArticle, loading: newsLoading } = useNews();

  const [hrs, setHrs] = useState(0);
  const [mins, setMins] = useState(0);
  const [secs, setSecs] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  const playAlertSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      [0, 0.2, 0.4].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime + delay);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.15);
      });
    } catch (e) {
      console.warn("Audio beep failed: ", e);
    }
  };

  const handleStartTimer = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      let currentSeconds = secondsRemaining;
      if (secondsRemaining <= 0) {
        const calculated = (hrs * 3600) + (mins * 60) + secs;
        if (calculated <= 0) return;
        setTotalSeconds(calculated);
        setSecondsRemaining(calculated);
        currentSeconds = calculated;
      }
      setIsTimerRunning(true);
      timerRef.current = setInterval(() => {
        currentSeconds -= 1;
        setSecondsRemaining(currentSeconds);
        if (currentSeconds <= 0) {
          setIsTimerRunning(false);
          clearInterval(timerRef.current);
          playAlertSound();
        }
      }, 1000);
    }
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsRemaining(0);
    setTotalSeconds(0);
    setHrs(0);
    setMins(0);
    setSecs(0);
  };

  const adjustValue = (type, action) => {
    if (isTimerRunning) return;
    if (type === 'hrs') setHrs((p) => action === 'up' ? Math.min(p + 1, 99) : Math.max(p - 1, 0));
    else if (type === 'mins') setMins((p) => action === 'up' ? Math.min(p + 1, 59) : Math.max(p - 1, 0));
    else if (type === 'secs') setSecs((p) => action === 'up' ? Math.min(p + 1, 59) : Math.max(p - 1, 0));
  };

  useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  const formatTimeOutput = (t) => {
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = totalSeconds > 0 ? (totalSeconds - secondsRemaining) / totalSeconds : 0;
  const strokeDashoffset = circumference - (progressPercent * circumference);

  return (
    <div className="w-screen h-screen bg-black text-white p-4 md:p-6 lg:p-8 select-none font-sans overflow-hidden">

      <div
        className="w-full h-full gap-4 md:gap-5"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '42% 18% 1fr',
          gridTemplateAreas: `
            "profile notes newscard"
            "weather notes newscard"
            "timer   timer newscard"
          `
        }}
      >

        {/* Profile Card */}
        <div style={{ gridArea: 'profile' }} className="bg-[#5746AF] rounded-2xl p-5 flex items-center gap-5 shadow-lg relative overflow-hidden">
          <button
            onClick={handleSignOut}
            className="absolute top-3 right-3 text-[9px] uppercase bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white/80 border border-white/10 rounded-full px-2.5 py-0.5 font-bold transition-all duration-150 active:scale-95 cursor-pointer"
          >
            Sign Out
          </button>

          <div className="w-[30%] aspect-[2/3] rounded-[18px] border-[3px] border-white overflow-hidden flex-shrink-0 shadow-md bg-white/10">
            <img src={profileLogo} alt="Profile Avatar" className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col justify-center flex-grow text-white overflow-hidden">
            <p className="text-sm text-white/80 leading-tight truncate">{user.name || 'KK Vinay'}</p>
            <p className="text-sm text-white/80 leading-tight mt-0.5 truncate">{user.email || 'vinay090@gmail.com'}</p>
            <h2 className="text-2xl font-semibold mt-1.5 leading-none truncate">{user.username || 'vinay060'}</h2>

            <div className="flex items-center gap-1.5 mt-3">
              <div className="grid grid-cols-2 gap-1.5 flex-grow max-h-[70px] overflow-y-auto pr-1 custom-scrollbar">
                {categories.map((cat) => (
                  <div key={cat} className="flex justify-center items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#9A8BF4]/40 text-white shadow-sm text-center truncate" title={cat}>
                    {cat}
                  </div>
                ))}
              </div>
              <button
                onClick={openCatEditor}
                className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-all duration-150 cursor-pointer active:scale-90"
                title="Edit categories"
              >
                <IoCreateOutline className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {showCatEditor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowCatEditor(false)}>
            <div className="bg-[#1a1a2e] rounded-2xl p-6 w-[90%] max-w-sm shadow-2xl border border-white/10" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Edit Categories</h3>
                <button onClick={() => setShowCatEditor(false)} className="text-white/60 hover:text-white transition-colors cursor-pointer">
                  <IoCloseOutline className="w-5 h-5" />
                </button>
              </div>
              <p className="text-white/50 text-xs mb-4">Select at least 3 categories</p>
              <div className="grid grid-cols-3 gap-2.5">
                {ALL_CATEGORIES.map((cat) => {
                  const isSelected = editingCats.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleEditCat(cat.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border-2 ${
                        isSelected
                          ? 'border-[#72DB73] text-white scale-[1.03] shadow-lg'
                          : 'border-transparent text-white/80 hover:scale-[1.02]'
                      }`}
                      style={{ backgroundColor: isSelected ? cat.color : cat.color + '55' }}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
              {editingCats.length < 3 && (
                <p className="text-red-400 text-[11px] font-medium mt-3 animate-pulse">⚠ Minimum 3 categories required</p>
              )}
              <div className="flex justify-end mt-5 gap-2.5">
                <button
                  onClick={() => setShowCatEditor(false)}
                  className="px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCatEdits}
                  disabled={editingCats.length < 3}
                  className="px-5 py-1.5 rounded-full bg-[#72DB73] text-black text-sm font-bold hover:bg-[#5ec45f] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Weather Strip */}
        <div style={{ gridArea: 'weather' }} className="flex flex-col rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-[#FF5EBF] h-[35%] min-h-[32px] flex items-center justify-between px-5 text-white text-base font-bold tracking-wide">
            <span>{formattedDate}</span>
            <span>{formattedTime}</span>
          </div>
          <div className="bg-[#10101d] flex-grow flex items-center justify-between px-4">
            {weatherLoading ? (
              <div className="flex items-center justify-center w-full h-full">
                <div className="w-7 h-7 rounded-full border-[3px] border-t-[#FF5EBF] border-white/20 animate-spin" />
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center gap-0.5 flex-1">
                  {getWeatherIconComponent(weather?.condition)}
                  <span className="text-[10px] font-medium text-white text-center line-clamp-1">{weather?.condition || 'Heavy rain'}</span>
                </div>
                <div className="w-[1px] bg-white/10 h-[55%] self-center" />
                <div className="flex flex-col items-center justify-center gap-0.5 flex-1">
                  <p className="text-3xl font-light text-white">{weather?.temp || 24}°C</p>
                  <div className="flex items-center gap-1 text-white">
                    <WiBarometer className="w-4 h-4" />
                    <div className="flex flex-col leading-none">
                      <span className="text-[9px] font-bold">{weather?.pressure || 1010} mbar</span>
                      <span className="text-[7px] text-gray-400">Pressure</span>
                    </div>
                  </div>
                </div>
                <div className="w-[1px] bg-white/10 h-[55%] self-center" />
                <div className="flex flex-col justify-center gap-2 flex-1 pl-2">
                  <div className="flex items-center gap-1 text-white">
                    <WiWindy className="w-4 h-4" />
                    <div className="flex flex-col leading-none">
                      <span className="text-[9px] font-bold">{weather?.wind || 3.7} km/h</span>
                      <span className="text-[7px] text-gray-400">Wind</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-white">
                    <WiHumidity className="w-4 h-4" />
                    <div className="flex flex-col leading-none">
                      <span className="text-[9px] font-bold">{weather?.humidity || 83}%</span>
                      <span className="text-[7px] text-gray-400">Humidity</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Notes Card */}
        <div style={{ gridArea: 'notes' }} className="bg-[#F3C95F] rounded-2xl p-5 flex flex-col gap-3 text-black shadow-lg overflow-hidden">
          <h3 className="text-2xl font-black tracking-wide">All notes</h3>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            className="w-full flex-grow resize-none text-sm font-semibold leading-relaxed outline-none border-none bg-transparent placeholder-black/35 focus:ring-0 custom-scrollbar pr-1 select-text"
            placeholder="Write down your thoughts, ideas or notes here..."
          />
        </div>

        {/* News Card (unified) */}
        <div style={{ gridArea: 'newscard' }} className="rounded-2xl overflow-hidden shadow-lg bg-white flex flex-col">
          {newsLoading ? (
            <div className="flex items-center justify-center w-full h-full bg-[#101010] rounded-2xl">
              <div className="w-9 h-9 rounded-full border-4 border-t-[#72DB73] border-white/20 animate-spin" />
            </div>
          ) : activeArticle ? (
            <>
              <div className="w-full h-[50%] flex-shrink-0 overflow-hidden relative">
                <img
                  src={activeArticle.urlToImage}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bg-black/70 bottom-0 left-0 right-0 px-4 py-3 ">
                  <h4 className="text-white text-lg font-bold leading-snug tracking-wide text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
                    {activeArticle.title}
                  </h4>
                </div>
              </div>
              
              <div className="flex flex-col flex-grow p-5 overflow-hidden">
                
                <p className="mt-3 text-gray-600 text-xs leading-relaxed font-medium flex-grow overflow-y-auto custom-scrollbar pr-1 text-justify">
                  {activeArticle.description || activeArticle.content || 'No description available.'}
                </p>
                <div className="flex justify-end mt-3 flex-shrink-0">
                  <button
                    onClick={() => navigate('/movies')}
                    className="px-6 py-2 rounded-full bg-[#148A08] text-white font-semibold text-sm hover:bg-[#117006] active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-lg"
                  >
                    Browse
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-[#101010] rounded-2xl">
              <p className="text-gray-500 text-sm">No news available</p>
            </div>
          )}
        </div>

        {/* Timer Widget */}
        <div style={{ gridArea: 'timer' }} className="bg-[#1E1F3B] rounded-2xl p-5 flex items-center justify-around gap-4 shadow-lg">
          <div className="relative flex-shrink-0" style={{ width: 140, height: 140 }}>
            <svg viewBox="0 0 140 140" className="w-full h-full transform -rotate-90">
              <circle cx="70" cy="70" r={radius} className="stroke-[#101020] fill-transparent" strokeWidth="7" />
              <circle
                cx="70" cy="70" r={radius}
                className="stroke-[#FF6B6B] fill-transparent transition-all duration-1000 ease-linear"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={isTimerRunning || secondsRemaining > 0 ? strokeDashoffset : circumference}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold tracking-wider">
                {formatTimeOutput(secondsRemaining > 0 ? secondsRemaining : (hrs * 3600) + (mins * 60) + secs)}
              </span>
              {isTimerRunning && (
                <span className="text-[9px] text-red-400 flex items-center gap-0.5 animate-pulse font-semibold mt-0.5 uppercase">
                  <IoTimeOutline /> Running
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between h-[80%] flex-grow max-w-xs gap-3">
            <div className="flex justify-around items-center text-center w-full">
              {[
                { label: 'Hours', val: hrs, key: 'hrs' },
                { label: 'Minutes', val: mins, key: 'mins' },
                { label: 'Seconds', val: secs, key: 'secs' },
              ].map((item, idx) => (
                <div key={item.key} className="flex flex-col items-center">
                  {idx > 0 && null}
                  <span className="text-gray-400 text-[10px] font-semibold mb-0.5 uppercase tracking-wide">{item.label}</span>
                  <button onClick={() => adjustValue(item.key, 'up')} disabled={isTimerRunning} className="hover:text-[#FF6B6B] disabled:opacity-30 transition-colors p-0.5 cursor-pointer">
                    <IoChevronUpOutline className="w-4 h-4 text-gray-400" />
                  </button>
                  <span className="text-2xl font-black font-mono my-0.5 select-none">{item.val.toString().padStart(2, '0')}</span>
                  <button onClick={() => adjustValue(item.key, 'down')} disabled={isTimerRunning} className="hover:text-[#FF6B6B] disabled:opacity-30 transition-colors p-0.5 cursor-pointer">
                    <IoChevronDownOutline className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2.5 w-full">
              <button
                onClick={handleStartTimer}
                className="flex-grow h-9 rounded-full bg-[#FF6B6B] text-white font-semibold text-sm hover:bg-[#ff5252] active:scale-98 transition-all duration-150 cursor-pointer flex items-center justify-center shadow-md"
              >
                {isTimerRunning ? 'Pause' : 'Start'}
              </button>
              {secondsRemaining > 0 && (
                <button
                  onClick={handleResetTimer}
                  className="px-4 h-9 rounded-full bg-white/10 text-white font-semibold text-sm hover:bg-white/20 active:scale-98 transition-all duration-150 cursor-pointer flex items-center justify-center shadow-md"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
