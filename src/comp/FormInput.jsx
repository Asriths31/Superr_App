import { useState } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

/**
 * Optimized FormInput for tight layouts to prevent page overflow.
 * Dynamically renders errors without taking up height when the form is valid.
 */
function FormInput({ name, type, value, setValue, isErr, errMsg }) {
  const cleanPlaceholder = name === 'User Name' ? 'UserName' : name;
  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full flex flex-col items-start">
      <div className="w-full relative">
        <input
          type={isPassword && showPassword ? 'text' : type}
          value={value ?? ""}
          onChange={(e) => setValue?.(e.target.value)}
          className={`w-full h-10 px-3.5 ${isPassword ? 'pr-10' : ''} text-white text-sm rounded-md outline-none bg-[#292929] transition-all duration-200 border-2 ${
            isErr ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#72DB73]'
          }`}
          placeholder={cleanPlaceholder}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer p-0.5"
            tabIndex={-1}
          >
            {showPassword
              ? <IoEyeOffOutline className="w-4.5 h-4.5" />
              : <IoEyeOutline className="w-4.5 h-4.5" />
            }
          </button>
        )}
      </div>
      {isErr && (
        <span className="text-[10px] text-red-500 font-semibold mt-0.5 ml-1 leading-none">
          {errMsg ?? "Field is required"}
        </span>
      )}
    </div>
  );
}

export default FormInput;