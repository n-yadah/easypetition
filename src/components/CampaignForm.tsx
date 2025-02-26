
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContactMethodSelector } from "./campaign/ContactMethodSelector";
import { RecipientSelector } from "./campaign/RecipientSelector";
import { MessageTemplate } from "./campaign/MessageTemplate";

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
      photo_url: string;
      email?: string;
      instagram_handle?: string;
      phone_number?: string;
    } | null;
  }) => void;
}

const EMAIL_TEMPLATE = `Dear {name},

I am writing regarding the crisis in the Democratic Republic of the Congo. The Rwandan Defense Forces (RDF) and M23 rebel group have killed over 3,000 civilians and captured strategic cities, threatening U.S. access to vital minerals.

Executive Order 13413 provides a framework for sanctions against those destabilizing the DRC. Strengthening these sanctions will help secure ethical supply chains for U.S. industries relying on critical materials.

The DRC's cobalt and strategic minerals are essential for clean energy, technology, defense, and manufacturing. Rwanda's military actions threaten U.S. economic and security interests.

Please support sanctions and policies that strengthen U.S.-DRC relations. Your leadership is crucial in protecting American industries from supply chain disruptions.

Thank you for your consideration.

Sincerely,
{sender}`;

const PHONE_TEMPLATE = `Hello, my name is {sender}. I'm calling about the crisis in DR Congo.

The M23 rebels, backed by Rwanda, have captured Goma and displaced thousands. This violates Congo's sovereignty and threatens U.S. interests.

In 2013, U.S. pressure on Rwanda through aid suspension worked. We need similar action now - either sanctions or aid suspension until Rwanda stops supporting M23.

Could you please support measures to restore peace in the region? Thank you for your time.`;

const DEFAULT_SUBJECT = "Support Sanctions on Rwanda to Protect U.S. Interests";

export default function CampaignForm({ onFormUpdate }: CampaignFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    subject: DEFAULT_SUBJECT,
    template: EMAIL_TEMPLATE,
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
        photo_url: selectedRecipient.photo_url || 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843',
        email: selectedRecipient.email,
        instagram_handle: selectedRecipient.instagram_handle || undefined,
        phone_number: selectedRecipient.phone_number
      } : null
    });
  }, [formData, recipients]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      template: formData.contactMethod === 'phone' ? PHONE_TEMPLATE : EMAIL_TEMPLATE
    }));
  }, [formData.contactMethod]);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn bg-white p-6 rounded-xl shadow-lg border border-gray-200">
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

      <ContactMethodSelector
        selectedMethod={formData.contactMethod}
        onMethodChange={(method) => setFormData({ ...formData, contactMethod: method })}
      />

      <RecipientSelector
        recipients={recipients}
        selectedRecipientId={formData.selectedRecipientId}
        onRecipientChange={(id) => setFormData({ ...formData, selectedRecipientId: id })}
        contactMethod={formData.contactMethod}
      />

      <MessageTemplate
        subject={formData.subject}
        template={formData.template}
        contactMethod={formData.contactMethod}
        onSubjectChange={(subject) => setFormData({ ...formData, subject })}
        onTemplateChange={(template) => setFormData({ ...formData, template })}
      />

      <Button 
        type="submit" 
        className="w-full py-4 bg-primary text-white shadow-sm hover:bg-primary/90"
      >
        {formData.contactMethod === 'phone' ? 'Start Call' : 'Prepare Message'}
      </Button>
    </form>
  );
}
