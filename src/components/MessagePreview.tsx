
import { Card } from "@/components/ui/card";
import { Mail, Instagram, Phone, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
  // Extract first name for Instagram messages
  const firstName = recipientName ? recipientName.split(' ')[0] : "Recipient";
  
  const previewMessage = template
    .replace(/{name}/g, recipientName)
    .replace(/{firstname}/g, firstName)
    .replace(/{sender}/g, senderName);

  const handleCopyMessage = () => {
    if (previewMessage) {
      navigator.clipboard.writeText(previewMessage).then(() => {
        toast({
          title: "Message Copied",
          description: "Message copied to clipboard. Use this in your direct message.",
          duration: 3000,
        });
      });
    }
  };

  const handleViewProfile = () => {
    if (instagramHandle) {
      const instagramUrl = `https://www.instagram.com/${instagramHandle}`;
      window.open(instagramUrl, '_blank');
    }
  };

  const handleSendMessage = () => {
    if (contactMethod === 'email' && email) {
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject || '')}&body=${encodeURIComponent(previewMessage)}`;
      window.location.href = mailtoLink;
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

      {contactMethod === 'instagram' ? (
        <div className="flex gap-2">
          <Button 
            onClick={handleCopyMessage} 
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Copy className="mr-2 h-4 w-4" /> Copy Message
          </Button>
          <Button 
            onClick={handleViewProfile}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <ExternalLink className="mr-2 h-4 w-4" /> View Profile
          </Button>
        </div>
      ) : (
        <Button 
          onClick={handleSendMessage}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {contactMethod === 'phone' ? 'Call Now' : 'Send Email'}
        </Button>
      )}
    </Card>
  );
}
