export function Input({
  value,
  setValue,
  placeholder,
  type
}: {
  type?: string;
  value: string|number;
  placeholder?: string;
  setValue: (value: string|number) => void;
}) {
  return (
    <input
      type={type||'text'}
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        let v: string | number = e.target.value
        if (type === 'number') {
          if (v === '') {
            v = 0
          } else {
            v = parseFloat(v)
          }
        }
        setValue(v)
      }}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
    />
  );
}

export function TextArea({
  placeholder,
  value,
  setValue,
  className
}: {
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  className?: string
}) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={"w-full px-4 py-2 border border-gray-300 rounded-lg " + (className ? className : "")}
    />
  )
}
