import React from "react";
import { useFormContext } from "react-hook-form";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  helperText?: string;
}

const InputField: React.FC<InputFieldProps> = ({ name, label, helperText, className = "", ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <fieldset className={`fieldset ${className}`}>
      {label && (
        <legend className="fieldset-legend dark:text-gray-400  dark:bg-transparent text-gray-900">{label}</legend>
      )}
      <input
        id={name}
        {...register(name)}
        {...props}
        className={`input w-full border border-gray-300 ${
          error ? "border-red-500" : ""
        } bg-white text-black dark:text-gray-100 dark:bg-gray-800 disabled:text-gray-400 disabled:bg-gray-200 disabled:border-0 disabled:cursor-not-allowed dark:disabled:bg-gray-700 dark:disabled:text-gray-400`}
      />
      {helperText && !error && (
        <label className="label">
          <span className="label-text-alt">{helperText}</span>
        </label>
      )}
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error.message?.toString()}</span>
        </label>
      )}
    </fieldset>
  );
};

export default InputField;
