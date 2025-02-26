
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

I am writing to urge your office to support a resolution imposing targeted sanctions against the Rwandan Defense Forces (RDF) and the M23 rebel group due to their destabilizing actions in the Democratic Republic of the Congo (DRC). They have killed more than 3,000 civilians in the span of two weeks and have captured two strategic cities in two of the most mineral rich provinces of the DRC. These activities threaten America's access to strategic minerals, including cobalt and other rare earth elements essential for industries across the United States.

Executive Order 13413, signed by Presidents Bush and Obama, provides a framework for holding accountable those who contribute to instability in the DRC. Strengthening and enforcing these sanctions against actors like the RDF and M23 will not only help dismantle the predatory system exploiting Congolese resources but also secure an ethical and stable supply chain for U.S. industries reliant on these critical materials.

A secure and transparent supply of cobalt, coltan and other strategic minerals is vital to multiple sectors, including clean energy, technology, defense, and advanced manufacturing. America depends on these materials for battery production, automotive manufacturing, aerospace, and military applications. Continued instability in the DRC, fueled by Rwandan-backed armed groups, threatens U.S. economic and national security interests.

I urge you to take decisive action in supporting sanctions and advocating for policies that reinforce U.S.-DRC relations and help bring peace to the region. Your leadership is crucial in ensuring that American industries are not left vulnerable to supply chain disruptions caused by Rwanda's military takeover of Congolese territory.

Thank you for your time and consideration. I look forward to your response.

Sincerely,
{sender}`;

const PHONE_TEMPLATE = `Hello, my name is {sender}. I'm calling about the crisis in DR Congo.

The M23 rebels, backed by Rwanda, have captured Goma and displaced thousands. This violates Congo's sovereignty and threatens U.S. interests.

In 2013, U.S. pressure on Rwanda through aid suspension worked. We need similar action now - either sanctions or aid suspension until Rwanda stops supporting M23.

Could you please support measures to restore peace in the region? Thank you for your time.`;

const DEFAULT_SUBJECT = "Urgent Call for Sanctions Against Rwanda to Protect U.S. Economic and National Security Interests";

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
    <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn bg-white px-3 py-4 md:p-6 rounded-xl shadow-lg border border-gray-200 max-w-full">
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
