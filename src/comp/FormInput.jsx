
/**
 * Optimized FormInput for tight layouts to prevent page overflow.
 * Dynamically renders errors without taking up height when the form is valid.
 */
function FormInput({ name, type, value, setValue, isErr, errMsg }) {
  const cleanPlaceholder = name === 'User Name' ? 'UserName' : name;

  return (
    <div className="w-full flex flex-col items-start">
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => setValue?.(e.target.value)}
        className={`w-full h-10 px-3.5 text-white text-sm rounded-md outline-none bg-[#292929] transition-all duration-200 border-2 ${
          isErr ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#72DB73]'
        }`}
        placeholder={cleanPlaceholder}
      />
      {isErr && (
        <span className="text-[10px] text-red-500 font-semibold mt-0.5 ml-1 leading-none">
          {errMsg ?? "Field is required"}
        </span>
      )}
    </div>
  );
}

export default FormInput;