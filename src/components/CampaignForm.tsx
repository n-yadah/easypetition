
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Instagram } from "lucide-react";
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
}

interface FormData {
  subject: string;
  template: string;
  selectedRecipientId: string;
  contactMethod: 'email' | 'instagram';
}

interface CampaignFormProps {
  onFormUpdate: (data: {
    subject: string;
    template: string;
    recipientName: string;
    contactMethod: 'email' | 'instagram';
  }) => void;
}

export default function CampaignForm({ onFormUpdate }: CampaignFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    subject: "",
    template: "",
    selectedRecipientId: "",
    contactMethod: 'email',
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
      contactMethod: formData.contactMethod
    });
  }, [formData, recipients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.template || !formData.selectedRecipientId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const recipient = recipients.find(r => r.id === formData.selectedRecipientId);
    if (!recipient) return;

    const contactInfo = formData.contactMethod === 'email' ? recipient.email : recipient.instagram_handle;

    toast({
      title: "Message Ready",
      description: `Your message will be sent to ${recipient.name} via ${formData.contactMethod} (${contactInfo})`,
    });
  };

  const selectedRecipient = recipients.find(r => r.id === formData.selectedRecipientId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Select Contact Method</label>
        <div className="flex gap-4">
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
            {recipients
              .filter(recipient => 
                formData.contactMethod === 'email' ? recipient.email : recipient.instagram_handle
              )
              .map((recipient) => (
                <SelectItem key={recipient.id} value={recipient.id}>
                  {recipient.name} - {recipient.position}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Message Template</label>
        <Textarea
          value={formData.template}
          onChange={(e) => setFormData({ ...formData, template: e.target.value })}
          placeholder="Enter your message. Use {name} for recipient name placeholder"
          className="w-full min-h-[200px] bg-white"
        />
      </div>

      <Button type="submit" className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-md">
        Prepare Message
      </Button>
    </form>
  );
}
