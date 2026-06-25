import { useState } from 'react';
import SignUp from './SignUp';
import SignIn from './SignIn';
import loginPageSideImage from '../assets/loginPageSide.png';

function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-black overflow-hidden font-sans">
      
      {/* Left Column: Hero Cover */}
      <div className="w-full md:w-[50vw] h-[40vh] md:h-full relative overflow-hidden flex items-end">
        <img
          src={loginPageSideImage}
          alt="Discover new things on Superapp"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay to ensure text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent pointer-events-none" />
        
        {/* Large Text Overlay at Bottom-Left */}
        <div className="relative z-10 p-6 md:p-12 pb-10 md:pb-16 max-w-lg">
          <h2 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-wide font-logo">
            Discover new things on Superapp
          </h2>
        </div>
      </div>

      {/* Right Column: Sign Up / Sign In Form Container */}
      <div className="w-full md:w-[50vw] h-[60vh] md:h-full flex items-center justify-center bg-black overflow-y-auto custom-scrollbar p-6">
        {isSignUp ? (
          <SignUp toggleView={() => setIsSignUp(false)} />
        ) : (
          <SignIn toggleView={() => setIsSignUp(true)} />
        )}
      </div>

    </div>
  );
}

export default LoginPage;