export default function Content({ header, children, width }) {
  return (
    <div className={`mx-auto min-w-fit m-8 ${width}`}>
      <div className="text-5xl font-bold text-white">{header}</div>
      <div className="bg-white rounded-md drop-shadow-md py-6 px-8 gap-6 flex flex-col mt-6">{children}</div>
    </div>
  )
}
