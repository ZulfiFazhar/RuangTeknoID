import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { SendHorizontal } from "lucide-react";

export default function ChatbotPage() {
  return (
    <div className="flex items-end justify-center h-[85vh]">
      <div className="w-6/12">
        <Card className="w-full">
          <CardContent className="flex justify-center items-center gap-5 pt-6">
            <Textarea placeholder="Asisten AI" />
            <Button>
              <SendHorizontal />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
