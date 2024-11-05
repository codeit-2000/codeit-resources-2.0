import clsx from "clsx";
import { ComponentProps } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends ComponentProps<"input"> {
  /** input의 id 속성입니다. name 속성도 동일하게 적용됩니다. */
  id: string;
  /** input의 label 속성입니다. */
  label: string;
  /** input의 error message 입니다. */
  errorMessage?: string;
  /** input 의 타입입니다. text, email, password */
  type?: "text" | "email" | "password";
  /** React Hook Form의 register 함수 반환 값입니다. */
  register?: UseFormRegisterReturn;
}

function Input({
  id,
  label,
  errorMessage = "",
  type = "text",
  register,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="relative">
        <input
          id={id}
          name={id}
          required
          type={type}
          {...register}
          className={clsx("input-base autofill-target peer", {
            "border-status-negative": errorMessage,
            "border-gray-100-opacity-60 placeholder-shown:border-gray-100-opacity-20 focus:border-purple-70 focus:bg-purple-5":
              !errorMessage,
          })}
          placeholder=" "
          {...props}
        />
        <label
          htmlFor={id}
          className={clsx("label-base label-placeholder-shown label-focus", {
            "text-status-negative": errorMessage,
            "text-gray-100-opacity-60 peer-focus:text-purple-70": !errorMessage,
          })}
        >
          {label}
        </label>
      </div>
      {errorMessage && (
        <span className="ml-10 text-13-400 text-status-negative">
          {errorMessage}
        </span>
      )}
    </div>
  );
}

export default Input;
