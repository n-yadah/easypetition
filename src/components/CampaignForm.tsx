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
  photo_url: string | null;
  description: string | null;
  created_at: string;
}

interface FormData {
  subject: string;
  template: string;
  selectedRecipientId: string;
  contactMethod: 'email' | 'instagram';
  senderName: string;
}

interface CampaignFormProps {
  onFormUpdate: (data: {
    subject: string;
    template: string;
    recipientName: string;
    senderName: string;
    contactMethod: 'email' | 'instagram';
    selectedRecipient: {
      name: string;
      position: string;
      description: string;
      photo_url: string;
      email?: string;
      instagram_handle?: string;
    } | null;
  }) => void;
}

export default function CampaignForm({ onFormUpdate }: CampaignFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    subject: "Urgent Call for Sanctions Against Rwanda to Protect U.S. Economic and National Security Interests",
    template: `Dear {name},

I am writing to urge your office to support a resolution imposing targeted sanctions against the Rwandan Defense Forces (RDF) and the M23 rebel group due to their destabilizing actions in the Democratic Republic of the Congo (DRC). They have killed more than 3,000 civilians in the span of two weeks and have captured two strategic cities in two of the most mineral rich provinces of the DRC. These activities threaten America's access to strategic minerals, including cobalt and other rare earth elements essential for industries across the United States.

Executive Order 13413, signed by Presidents Bush and Obama, provides a framework for holding accountable those who contribute to instability in the DRC. Strengthening and enforcing these sanctions against actors like the RDF and M23 will not only help dismantle the predatory system exploiting Congolese resources but also secure an ethical and stable supply chain for U.S. industries reliant on these critical materials.

A secure and transparent supply of cobalt, coltan and other strategic minerals is vital to multiple sectors, including clean energy, technology, defense, and advanced manufacturing. America depends on these materials for battery production, automotive manufacturing, aerospace, and military applications. Continued instability in the DRC, fueled by Rwandan-backed armed groups, threatens U.S. economic and national security interests.

I urge you to take decisive action in supporting sanctions and advocating for policies that reinforce U.S.-DRC relations and help bring peace to the region. Your leadership is crucial in ensuring that American industries are not left vulnerable to supply chain disruptions caused by Rwanda's military takeover of Congolese territory.

Thank you for your time and consideration. I look forward to your response.

Sincerely,
{sender}`,
    selectedRecipientId: "",
    contactMethod: 'email',
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
        const validatedData: Recipient[] = data.map(recipient => ({
          ...recipient,
          photo_url: recipient.photo_url || 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843',
          description: recipient.description || 'No description available',
          email: recipient.email || '',
          instagram_handle: recipient.instagram_handle || null
        }));
        setRecipients(validatedData);
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
        instagram_handle: selectedRecipient.instagram_handle || undefined
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

    const contactInfo = formData.contactMethod === 'email' ? recipient.email : recipient.instagram_handle;

    toast({
      title: "Message Ready",
      description: `Your message will be sent to ${recipient.name} via ${formData.contactMethod} (${contactInfo})`,
    });
  };

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
        <p className="text-xs text-gray-500">Use {'{name}'} for recipient name and {'{sender}'} for your name</p>
        <Textarea
          value={formData.template}
          onChange={(e) => setFormData({ ...formData, template: e.target.value })}
          placeholder="Enter your message"
          className="w-full min-h-[200px] bg-white"
        />
      </div>

      <Button type="submit" className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-md">
        Prepare Message
      </Button>
    </form>
  );
}
