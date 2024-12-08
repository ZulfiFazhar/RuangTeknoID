import { Sparkles } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function ChatLoading() {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-center p-3 rounded-lg max-w-xs">
        <Sparkles className="mr-4" size={20} />
        <Spinner size="small" />
      </div>
    </div>
  );
}
