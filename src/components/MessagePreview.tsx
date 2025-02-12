
import { Card } from "@/components/ui/card";
import { Mail, Instagram } from "lucide-react";

interface MessagePreviewProps {
  template: string;
  recipientName?: string;
  senderName?: string;
  subject?: string;
  contactMethod?: 'email' | 'instagram';
}

export default function MessagePreview({ 
  template, 
  recipientName = "Recipient",
  senderName = "Sender",
  subject,
  contactMethod = 'email'
}: MessagePreviewProps) {
  const previewMessage = template
    .replace(/{name}/g, recipientName)
    .replace(/{sender}/g, senderName);

  return (
    <Card className="p-6 bg-white shadow-sm border animate-slideIn">
      <div className="flex items-center gap-2 mb-4">
        {contactMethod === 'email' ? (
          <Mail className="w-5 h-5 text-primary" />
        ) : (
          <Instagram className="w-5 h-5 text-primary" />
        )}
        <h3 className="text-lg font-semibold">Message Preview</h3>
      </div>
      
      {contactMethod === 'email' && subject && (
        <div className="mb-4">
          <p className="text-sm text-gray-500">Subject:</p>
          <p className="text-gray-700">{subject}</p>
        </div>
      )}

      <div className="prose max-w-none">
        <p className="text-sm text-gray-500">Message:</p>
        <p className="whitespace-pre-wrap text-gray-700">{previewMessage}</p>
      </div>
    </Card>
  );
}
