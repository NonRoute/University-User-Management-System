export default function SelectWithLabel({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-lg">{label}</label>
      <select required className="bg-gray-200 text-xl rounded py-2 px-3" value={value} onChange={onChange}>
        <option hidden></option>
        {options?.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          )
        })}
      </select>
    </div>
  )
}
