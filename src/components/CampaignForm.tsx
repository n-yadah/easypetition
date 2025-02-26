import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Instagram, Phone } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Recipient {
  id: string;
  name: string;
  position: string;
  email: string;
  instagram_handle: string | null;
  photo_url: string | null;
  description: string | null;
  created_at: string;
  phone_number?: string;
}

interface FormData {
  subject: string;
  template: string;
  selectedRecipientId: string;
  contactMethod: 'email' | 'instagram' | 'phone';
  senderName: string;
}

interface CampaignFormProps {
  onFormUpdate: (data: {
    subject: string;
    template: string;
    recipientName: string;
    senderName: string;
    contactMethod: 'email' | 'instagram' | 'phone';
    selectedRecipient: {
      name: string;
      position: string;
      description: string;
      photo_url: string;
      email?: string;
      instagram_handle?: string;
      phone_number?: string;
    } | null;
  }) => void;
}

export default function CampaignForm({ onFormUpdate }: CampaignFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    subject: "",
    template: "",
    selectedRecipientId: "",
    contactMethod: 'phone',
    senderName: "",
  });
  const [recipients, setRecipients] = useState<Recipient[]>([]);

  useEffect(() => {
    const fetchRecipients = async () => {
      const { data, error } = await supabase
        .from('recipients')
        .select('*');
      
      if (error) {
        toast({
          title: "Error loading recipients",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setRecipients(data);
      }
    };

    fetchRecipients();
  }, []);

  useEffect(() => {
    const selectedRecipient = recipients.find(r => r.id === formData.selectedRecipientId);
    onFormUpdate({
      subject: formData.subject,
      template: formData.template,
      recipientName: selectedRecipient?.name || "",
      senderName: formData.senderName,
      contactMethod: formData.contactMethod,
      selectedRecipient: selectedRecipient ? {
        name: selectedRecipient.name,
        position: selectedRecipient.position,
        description: selectedRecipient.description || 'No description available',
        photo_url: selectedRecipient.photo_url || 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843',
        email: selectedRecipient.email,
        instagram_handle: selectedRecipient.instagram_handle || undefined,
        phone_number: selectedRecipient.phone_number
      } : null
    });
  }, [formData, recipients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.template || !formData.selectedRecipientId || !formData.senderName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const recipient = recipients.find(r => r.id === formData.selectedRecipientId);
    if (!recipient) return;

    let contactInfo;
    switch (formData.contactMethod) {
      case 'email':
        contactInfo = recipient.email;
        break;
      case 'instagram':
        contactInfo = recipient.instagram_handle;
        break;
      case 'phone':
        contactInfo = recipient.phone_number;
        break;
    }

    if (formData.contactMethod === 'phone' && recipient.phone_number) {
      window.location.href = `tel:${recipient.phone_number.replace(/[^0-9]/g, '')}`;
    }

    toast({
      title: "Ready to Contact",
      description: `${formData.contactMethod === 'phone' ? 'Calling' : 'Your message will be sent to'} ${recipient.name} via ${formData.contactMethod} (${contactInfo})`,
    });
  };

  const filteredRecipients = recipients.filter(recipient => {
    switch (formData.contactMethod) {
      case 'email':
        return recipient.email && recipient.email.trim() !== '';
      case 'instagram':
        return recipient.instagram_handle && recipient.instagram_handle.trim() !== '';
      case 'phone':
        return recipient.phone_number && recipient.phone_number.trim() !== '';
      default:
        return false;
    }
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Your Name</label>
        <Input
          type="text"
          value={formData.senderName}
          onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
          placeholder="Enter your name"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Select Contact Method</label>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={formData.contactMethod === 'phone' ? 'default' : 'outline'}
            className="flex-1 flex items-center justify-center gap-2"
            onClick={() => setFormData({ ...formData, contactMethod: 'phone' })}
          >
            <Phone className="w-4 h-4" />
            Phone
          </Button>
          <Button
            type="button"
            variant={formData.contactMethod === 'email' ? 'default' : 'outline'}
            className="flex-1 flex items-center justify-center gap-2"
            onClick={() => setFormData({ ...formData, contactMethod: 'email' })}
          >
            <Mail className="w-4 h-4" />
            Email
          </Button>
          <Button
            type="button"
            variant={formData.contactMethod === 'instagram' ? 'default' : 'outline'}
            className="flex-1 flex items-center justify-center gap-2"
            onClick={() => setFormData({ ...formData, contactMethod: 'instagram' })}
          >
            <Instagram className="w-4 h-4" />
            Instagram
          </Button>
        </div>
      </div>

      {formData.contactMethod === 'email' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Subject</label>
          <Input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Enter message subject"
            className="w-full"
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Select Recipient</label>
        <Select
          value={formData.selectedRecipientId}
          onValueChange={(value) => setFormData({ ...formData, selectedRecipientId: value })}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Choose a decision maker" />
          </SelectTrigger>
          <SelectContent>
            {filteredRecipients.map((recipient) => (
              <SelectItem key={recipient.id} value={recipient.id}>
                {recipient.name} - {recipient.position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {formData.contactMethod === 'phone' ? 'Call Script' : 'Message Template'}
        </label>
        <p className="text-xs text-gray-500">Use {'{name}'} for recipient name and {'{sender}'} for your name</p>
        <Textarea
          value={formData.template}
          onChange={(e) => setFormData({ ...formData, template: e.target.value })}
          placeholder={formData.contactMethod === 'phone' ? "Enter your call script" : "Enter your message"}
          className="w-full min-h-[200px] bg-white"
        />
      </div>

      <Button type="submit" className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-md">
        {formData.contactMethod === 'phone' ? 'Start Call' : 'Prepare Message'}
      </Button>
    </form>
  );
}
