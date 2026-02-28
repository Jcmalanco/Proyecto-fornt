export default function StatusBox({ loading, error, success }) {
  if (loading) return <p className="p-2 bg-gray-100 text-black">🚀 Procesando...</p>
  if (error) return <p className="p-2 bg-red-100 text-black">❌ {error}</p>
  if (success) return <p className="p-2 bg-green-100 text-black">✅ {success}</p>
  return null;
}