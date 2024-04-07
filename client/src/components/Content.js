export default function Content({ header, children, width }) {
  return (
    <div className={`mx-auto mt-8 pb-8 ${width}`}>
      <div className="text-5xl font-bold text-white mx-6 md:mx-8 drop-shadow-md">{header}</div>
      <div className="bg-white rounded-md drop-shadow-md py-6 px-8 gap-6 flex flex-col mt-6 mx-6 md:mx-8">
        {children}
      </div>
    </div>
  )
}
