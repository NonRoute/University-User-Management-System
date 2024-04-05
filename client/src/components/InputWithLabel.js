export default function InputWithLabel({ label }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-lg">{label}</label>
      <input required className="bg-gray-200 text-xl rounded p-2" />
    </div>
  )
}
