import { useState } from 'react';
import { useNavigate } from 'react-router';
import FormInput from './FormInput';

function SignUp({ toggleView }) {
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);

  // Errors states
  const [errors, setErrors] = useState({});
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [modalType, setModalType] = useState('terms'); // 'terms' or 'privacy'

  // Validate inputs
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Field is required';
    if (!username.trim()) newErrors.username = 'Field is required';
    
    if (!email.trim()) {
      newErrors.email = 'Field is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Invalid email address';
      }
    }

    if (!mobile.trim()) {
      newErrors.mobile = 'Field is required';
    } else {
      const mobileRegex = /^\d{10}$/;
      if (!mobileRegex.test(mobile)) {
        newErrors.mobile = 'Must be a 10-digit number';
      }
    }

    if (!password) {
      newErrors.password = 'Field is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password Should Be Min 8 Char';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Field is required';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const userData = { name, username, email, mobile, password };
      localStorage.setItem('superapp_user', JSON.stringify(userData));
      navigate('/categories');
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setShowTermsModal(true);
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center justify-center p-4 text-white">
      <h1 className="text-4xl font-semibold font-logo text-[#72DB73] mb-1 tracking-wide text-center">
        Super app
      </h1>
      <p className="text-sm text-gray-400 mb-4 text-center">
        Create your new account
      </p>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-1.5">
        <FormInput
          name="Name"
          type="text"
          value={name}
          setValue={setName}
          isErr={!!errors.name}
          errMsg={errors.name}
        />

        <FormInput
          name="UserName"
          type="text"
          value={username}
          setValue={setUsername}
          isErr={!!errors.username}
          errMsg={errors.username}
        />

        <FormInput
          name="Email"
          type="text"
          value={email}
          setValue={setEmail}
          isErr={!!errors.email}
          errMsg={errors.email}
        />

        <FormInput
          name="Mobile"
          type="text"
          value={mobile}
          setValue={setMobile}
          isErr={!!errors.mobile}
          errMsg={errors.mobile}
        />

        <FormInput
          name="Password"
          type="password"
          value={password}
          setValue={setPassword}
          isErr={!!errors.password}
          errMsg={errors.password}
        />

        <FormInput
          name="Confirm Password"
          type="password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          isErr={!!errors.confirmPassword}
          errMsg={errors.confirmPassword}
        />

        {/* Checkbox field */}
        <div className="flex flex-col mt-1 mb-1">
          <label className="flex items-center gap-3 cursor-pointer text-gray-400 text-xs">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-transparent text-[#72DB73] focus:ring-0 cursor-pointer"
            />
            <span>Share my registration data with Superapp</span>
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full h-10 mt-1 rounded-full bg-[#72DB73] text-black font-bold text-base hover:bg-[#5ec45f] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-lg"
        >
          SIGN UP
        </button>
      </form>

      {/* Disclaimers with click-to-popup links */}
      <div className="w-full mt-4 text-[10px] text-gray-500 leading-relaxed">
        <p className="mb-1.5">
          By clicking on Sign up, you agree to Superapp{' '}
          <span
            onClick={() => openModal('terms')}
            className="text-[#72DB73] hover:underline cursor-pointer font-medium"
          >
            Terms and Conditions of Use
          </span>
        </p>
        <p>
          To learn more about how Superapp collects, uses, shares and protects your personal data please read Superapp{' '}
          <span
            onClick={() => openModal('privacy')}
            className="text-[#72DB73] hover:underline cursor-pointer font-medium"
          >
            Privacy Policy
          </span>
        </p>
      </div>

      {/* Toggling to Sign In */}
      <p className="mt-5 text-xs text-gray-400">
        Already have an account?{' '}
        <span
          onClick={toggleView}
          className="text-[#72DB73] font-bold hover:underline cursor-pointer ml-1"
        >
          Log In
        </span>
      </p>

      {/* Terms & Conditions Modal Overlay */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-[#181818] border border-[#2d2d2d] rounded-xl p-6 shadow-2xl relative">
            <h2 className="text-2xl font-bold text-[#72DB73] mb-4">
              {modalType === 'terms' ? 'Terms and Conditions' : 'Privacy Policy'}
            </h2>
            <div className="h-60 overflow-y-auto pr-2 text-sm text-gray-300 leading-relaxed flex flex-col gap-3 custom-scrollbar">
              {modalType === 'terms' ? (
                <>
                  <p className="font-semibold text-white">1. Introduction</p>
                  <p>Welcome to Superapp! By registering for an account, you agree to be bound by these dummy Terms and Conditions of Use.</p>
                  <p className="font-semibold text-white">2. User Account</p>
                  <p>You must maintain the security of your account username and password. You are responsible for all activities occurring under your credentials.</p>
                  <p className="font-semibold text-white">3. Intellectual Property</p>
                  <p>All software, visuals, and widgets are copyright property of Superapp and partners. Reproduction of code assets is strictly prohibited.</p>
                  <p className="font-semibold text-white">4. User Content</p>
                  <p>You retain rights to all notes created inside the dashboard. Notes are saved in local storage on your client device and are never sent to external servers.</p>
                  <p className="font-semibold text-white">5. Termination</p>
                  <p>We reserve the right to suspend or block access to the movie discovery catalog if user attempts brute-forcing or API spamming.</p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-white">1. Data Collection</p>
                  <p>We collect your registration details: Name, Username, Email, and Mobile number. This data is stored strictly in your browser's local storage.</p>
                  <p className="font-semibold text-white">2. How We Use Data</p>
                  <p>Your details are used solely to personalize widgets (such as the Profile Section in your Super Dashboard) and to filter movies by your preferred genres.</p>
                  <p className="font-semibold text-white">3. Third-Party Integrations</p>
                  <p>We pull current weather details using coordinates via OpenWeatherMap, headlines via NewsAPI, and catalog displays via OMDb. No personal details are transmitted to these third parties.</p>
                  <p className="font-semibold text-white">4. Cookies & local storage</p>
                  <p>Your user profile information, selected onboarding categories, and notes are saved natively on your machine. Clearing your browser cache will erase this configuration.</p>
                </>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#2d2d2d]">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-5 h-9 rounded-md bg-[#72DB73] text-black font-semibold hover:bg-[#5ec45f] active:scale-95 transition-all duration-150 cursor-pointer text-sm"
              >
                Close & Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;
