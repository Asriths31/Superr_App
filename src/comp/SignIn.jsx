import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import FormInput from './FormInput';

function SignIn({ toggleView }) {
  const navigate = useNavigate();

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  // Validate inputs
  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Field is required';
    }

    if (!password) {
      newErrors.password = 'Field is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password Should Be Min 8 Char';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Check if user is registered in localStorage
      const savedUserStr = localStorage.getItem('superapp_user');
      let savedUser = null;
      if (savedUserStr) {
        try {
          savedUser = JSON.parse(savedUserStr);
        } catch (err) {
          console.error(err);
        }
      }
      if (savedUser == null) {
        setErrors({ username: 'Username does not exist' });
        return;
      }


      if (savedUser.username !== username) {
        setErrors({ username: 'Username does not match registered account' });
        return;
      }
      if (savedUser.password && savedUser.password !== password) {
        setErrors({ password: 'Incorrect password' });
        return;
      }


      // Check categories onboarding
      const categoriesStr = localStorage.getItem('superapp_categories');
      const categories = categoriesStr ? JSON.parse(categoriesStr) : [];

      if (categories.length >= 3) {
        navigate('/dashboard');
      } else {
        navigate('/categories');
      }
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center justify-center p-6 text-white select-none animate-fadeIn">
      <h1 className="text-5xl font-semibold font-logo text-[#72DB73] mb-2 tracking-wide text-center">
        Super app
      </h1>
      <p className="text-base text-gray-400 mb-8 text-center">
        Log into your account
      </p>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
        <FormInput
          name="User Name"
          type="text"
          value={username}
          setValue={setUsername}
          isErr={!!errors.username}
          errMsg={errors.username}
        />

        <FormInput
          name="Password"
          type="password"
          value={password}
          setValue={setPassword}
          isErr={!!errors.password}
          errMsg={errors.password}
        />

        {/* Submit button */}
        <button
          type="submit"
          className="w-full h-11 mt-4 rounded-full bg-[#72DB73] text-black font-bold text-lg hover:bg-[#5ec45f] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-lg"
        >
          SIGN IN
        </button>
      </form>

      {/* Toggling to Sign Up */}
      <p className="mt-8 text-sm text-gray-400">
        Don't have an account?{' '}
        <span
          onClick={toggleView}
          className="text-[#72DB73] font-bold hover:underline cursor-pointer ml-1"
        >
          Register
        </span>
      </p>
    </div>
  );
}

export default SignIn;