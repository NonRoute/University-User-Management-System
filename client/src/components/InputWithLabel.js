export default function InputWithLabel({ label, type, autoComplete, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-lg">{label}</label>
      <input
        required
        className="bg-gray-200 text-xl rounded py-2 px-3"
        type={type}
        autoComplete={autoComplete}
        onChange={onChange}
      />
    </div>
  )
}
