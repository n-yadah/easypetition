
import { Card } from "@/components/ui/card";

interface MessagePreviewProps {
  template: string;
  recipientName?: string;
}

export default function MessagePreview({ template, recipientName = "Recipient" }: MessagePreviewProps) {
  const previewMessage = template.replace(/{name}/g, recipientName);

  return (
    <Card className="p-6 bg-white shadow-sm border animate-slideIn">
      <h3 className="text-lg font-semibold mb-4">Message Preview</h3>
      <div className="prose max-w-none">
        <p className="whitespace-pre-wrap text-gray-700">{previewMessage}</p>
      </div>
    </Card>
  );
}
