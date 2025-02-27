
import { Card } from "@/components/ui/card";
import { Mail, Instagram, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessagePreviewProps {
  template: string;
  recipientName?: string;
  senderName?: string;
  subject?: string;
  contactMethod?: 'email' | 'instagram' | 'phone';
  instagramHandle?: string;
  email?: string;
  phoneNumber?: string;
}

export default function MessagePreview({ 
  template, 
  recipientName = "Recipient",
  senderName = "Sender",
  subject,
  contactMethod = 'email',
  instagramHandle,
  email,
  phoneNumber
}: MessagePreviewProps) {
  const previewMessage = template
    .replace(/{name}/g, recipientName)
    .replace(/{sender}/g, senderName);

  const handleSendMessage = () => {
    if (contactMethod === 'email' && email) {
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject || '')}&body=${encodeURIComponent(previewMessage)}`;
      window.location.href = mailtoLink;
    } else if (contactMethod === 'instagram' && instagramHandle) {
      // Open the profile in Instagram - more reliable than trying to open DMs directly
      const instagramUrl = `https://www.instagram.com/${instagramHandle}`;
      window.open(instagramUrl, '_blank');
      
      // Copy message to clipboard for easy pasting
      navigator.clipboard.writeText(previewMessage).then(() => {
        // Show toast notification that message was copied (handled by parent component)
        const event = new CustomEvent('messagecopied', { 
          detail: 'Message copied to clipboard. Please click the "Message" button on their profile to send.'
        });
        window.dispatchEvent(event);
      });
    } else if (contactMethod === 'phone' && phoneNumber) {
      window.location.href = `tel:${phoneNumber.replace(/[^0-9]/g, '')}`;
    }
  };

  return (
    <Card className="p-6 bg-white shadow-sm border animate-slideIn">
      <div className="flex items-center gap-2 mb-4">
        {contactMethod === 'email' ? (
          <Mail className="w-5 h-5 text-primary" />
        ) : contactMethod === 'instagram' ? (
          <Instagram className="w-5 h-5 text-primary" />
        ) : (
          <Phone className="w-5 h-5 text-primary" />
        )}
        <h3 className="text-lg font-semibold">
          {contactMethod === 'phone' ? 'Call Script' : 'Message Preview'}
        </h3>
      </div>
      
      {contactMethod === 'email' && subject && (
        <div className="mb-4">
          <p className="text-sm text-gray-500">Subject:</p>
          <p className="text-gray-700">{subject}</p>
        </div>
      )}

      {contactMethod === 'instagram' && instagramHandle && (
        <div className="mb-4">
          <p className="text-sm text-gray-500">Instagram Handle:</p>
          <p className="text-gray-700 flex items-center">
            <Instagram className="w-4 h-4 mr-1" />
            @{instagramHandle}
            <a 
              href={`https://www.instagram.com/${instagramHandle}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 text-primary hover:underline text-xs"
            >
              (View Profile)
            </a>
          </p>
        </div>
      )}

      {contactMethod === 'phone' && phoneNumber && (
        <div className="mb-4">
          <p className="text-sm text-gray-500">Phone Number:</p>
          <p className="text-gray-700">{phoneNumber}</p>
        </div>
      )}

      <div className="prose max-w-none mb-4">
        <p className="text-sm text-gray-500">{contactMethod === 'phone' ? 'Script:' : 'Message:'}</p>
        <p className="whitespace-pre-wrap text-gray-700">{previewMessage}</p>
      </div>

      <Button 
        onClick={handleSendMessage}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {contactMethod === 'phone' 
          ? 'Call Now' 
          : contactMethod === 'instagram'
          ? 'View Profile & Send Message'
          : 'Send Email'}
      </Button>
    </Card>
  );
}
