import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  invalid?: boolean;
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  invalid?: boolean;
}

export function Input({ name, label, invalid=false, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label htmlFor={name} className="ml-2 mb-1 w-full font-semibold">{label}</label> }
      <input
        name={name}
        id={name}
        {...props}
        className={`px-4 h-12 w-full rounded-full border bg-white
              outline-none focus:ring-2
              ${invalid ? "border-2 ring-blue-400 border-red-400" : "border-slate-300 focus:ring-blue-500"}`}
      />
    </div>
  );
}

export function TextArea({ name, label, invalid=false, ...props }: TextAreaProps) {
  return (
    <div className="w-full">
      {label && <label htmlFor={name} className="ml-2 font-semibold">{label}</label>}
        <textarea
          name={name}
          id={name}
          {...props}
          className={`mt-1 px-4 py-3 w-full rounded-3xl border bg-white
              outline-none focus:ring-2
              ${invalid ? "border-2 ring-blue-400 border-red-400" : "border-slate-300 focus:ring-blue-500"}`}
        />
    </div>
  );
}
