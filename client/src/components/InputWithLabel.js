export default function InputWithLabel({ label, type, autoComplete, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-lg">{label}</label>
      <input
        required
        className="bg-gray-200 text-xl rounded py-2 px-3"
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={onChange}
      />
    </div>
  )
}
