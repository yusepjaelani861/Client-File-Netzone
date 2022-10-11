export default function RightBar({ data }) {
    console.log(data)
  return (
    <>
      <div id="kanan-bar" className="w-[200px]" style={
        window.innerWidth < 768 ? { display: 'none' } : { display: 'block' }
      }>
        <div className="flex flex-col mx-auto bg-white py-4 rounded-xl shadow-lg border">
          <ul className="flex flex-col flex-1 overflow-y-auto mx-auto">
            {data.map((item, index) => (
                <li key={index} className="flex items-center px-4 py-2 text-sm font-medium">
                <a href={item.link} className="flex-1">
                  {item.name}
                </a>
              </li>    
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
