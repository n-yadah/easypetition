
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ContactMethodSelector } from "./campaign/ContactMethodSelector";
import { RecipientSelector } from "./campaign/RecipientSelector";
import { MessageTemplate } from "./campaign/MessageTemplate";
import { useRecipients } from "@/hooks/useRecipients";
import { EMAIL_TEMPLATE, INSTAGRAM_TEMPLATE, PHONE_TEMPLATE, DEFAULT_SUBJECT } from "@/constants/messageTemplates";
import type { FormData, CampaignFormProps } from "@/types/campaign";

export default function CampaignForm({ onFormUpdate }: CampaignFormProps) {
  const { toast } = useToast();
  const recipients = useRecipients();
  
  const [formData, setFormData] = useState<FormData>({
    subject: DEFAULT_SUBJECT,
    template: EMAIL_TEMPLATE,
    selectedRecipientId: "",
    contactMethod: 'phone',
    senderName: "",
  });

  const [contactInfoMessage, setContactInfoMessage] = useState<string | null>(null);

  // Log the recipient data for debugging
  useEffect(() => {
    console.log("Available recipients:", recipients);
    recipients.forEach(recipient => {
      console.log(`Recipient ${recipient.name}: email=${recipient.email}, instagram=${recipient.instagram_handle}, phone=${recipient.phone_number}`);
    });
  }, [recipients]);

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
  }, [formData, recipients, onFormUpdate]);

  useEffect(() => {
    let newTemplate;
    switch (formData.contactMethod) {
      case 'phone':
        newTemplate = PHONE_TEMPLATE;
        break;
      case 'instagram':
        newTemplate = INSTAGRAM_TEMPLATE;
        break;
      default:
        newTemplate = EMAIL_TEMPLATE;
    }
    
    setFormData(prev => ({
      ...prev,
      template: newTemplate
    }));
  }, [formData.contactMethod]);

  useEffect(() => {
    const handleMessageCopied = (event: CustomEvent<string>) => {
      toast({
        title: "Message Ready",
        description: event.detail,
      });
    };

    window.addEventListener('messagecopied', handleMessageCopied as EventListener);
    return () => {
      window.removeEventListener('messagecopied', handleMessageCopied as EventListener);
    };
  }, [toast]);

  // Check if selected recipient has data for the current contact method
  const handleContactMethodChange = (method: 'email' | 'instagram' | 'phone') => {
    setFormData(prev => ({ ...prev, contactMethod: method }));
    
    // When changing contact method, clear the recipient selection
    setFormData(prev => ({ 
      ...prev, 
      contactMethod: method,
      selectedRecipientId: "" 
    }));
    
    // Clear any previous message
    setContactInfoMessage(null);
  };

  const handleRecipientChange = (id: string) => {
    const recipient = recipients.find(r => r.id === id);
    setFormData(prev => ({ ...prev, selectedRecipientId: id }));
    
    // Clear any previous message
    setContactInfoMessage(null);
    
    // Check if the recipient has the selected contact method
    if (recipient) {
      const hasContactData = 
        (formData.contactMethod === 'email' && recipient.email) ||
        (formData.contactMethod === 'instagram' && recipient.instagram_handle) ||
        (formData.contactMethod === 'phone' && recipient.phone_number);
      
      if (!hasContactData) {
        setContactInfoMessage(`${recipient.name} doesn't have ${formData.contactMethod} contact information available.`);
      }
    }
  };

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
        onMethodChange={handleContactMethodChange}
      />

      <div className="space-y-2">
        <RecipientSelector
          recipients={recipients}
          selectedRecipientId={formData.selectedRecipientId}
          onRecipientChange={handleRecipientChange}
          contactMethod={formData.contactMethod}
        />
        
        {contactInfoMessage && (
          <div className="text-amber-600 text-sm mt-1 px-1">
            {contactInfoMessage}
          </div>
        )}
      </div>

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
        disabled={!!contactInfoMessage || !formData.selectedRecipientId}
      >
        {formData.contactMethod === 'phone' ? 'Start Call' : 'Prepare Message'}
      </Button>
    </form>
  );
}
