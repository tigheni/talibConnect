import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ReturnBackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 px-4 py-2 bg-[#5ae4a8] text-black rounded-lg hover:bg-[#3bc85a] transition mb-4"
    >
      <ArrowLeft size={28} className="text-xl" />

      <span>Back</span>
    </button>
  );
}
