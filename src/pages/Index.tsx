
import { useState } from "react";
import CampaignForm from "@/components/CampaignForm";
import MessagePreview from "@/components/MessagePreview";
import RecipientCard from "@/components/RecipientCard";

interface FormState {
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
}

const Index = () => {
  const [formState, setFormState] = useState<FormState>({
    subject: "",
    template: "Dear {name},\n\nI am writing to express my concern about...\n\nSincerely,\n{sender}",
    recipientName: "",
    senderName: "",
    contactMethod: 'email',
    selectedRecipient: null
  });

  const handleFormUpdate = (data: FormState) => {
    setFormState(prev => ({ ...prev, ...data }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2 leading-relaxed py-1">
              Take Action for Change
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Connect with decision makers and make your voice heard
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <CampaignForm onFormUpdate={handleFormUpdate} />
            </div>

            <div className="space-y-6">
              {formState.selectedRecipient && (
                <RecipientCard
                  name={formState.selectedRecipient.name}
                  position={formState.selectedRecipient.position}
                  photoUrl={formState.selectedRecipient.photo_url}
                />
              )}
              <MessagePreview 
                template={formState.template}
                recipientName={formState.recipientName}
                senderName={formState.senderName}
                subject={formState.subject}
                contactMethod={formState.contactMethod}
                email={formState.selectedRecipient?.email}
                instagramHandle={formState.selectedRecipient?.instagram_handle}
                phoneNumber={formState.selectedRecipient?.phone_number}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
