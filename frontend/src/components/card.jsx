export default function Card({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-3 hover:shadow-md transition">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-xl font-semibold">{value}</h3>
      </div>
    </div>
  );
}
