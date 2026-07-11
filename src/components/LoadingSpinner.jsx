export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex gap-2" aria-label="Loading">
        <div className="w-4 h-4 bg-[#5ae4a8] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 bg-[#5ae4a8] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-4 h-4 bg-[#5ae4a8] rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}
