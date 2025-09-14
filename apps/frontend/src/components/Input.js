export default function Input({ type = "text", ...props }) {
  return (
    <input
      type={type}
      {...props}
      className="border px-3 py-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
