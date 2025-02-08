
import { useState } from "react";
import CampaignForm from "@/components/CampaignForm";
import MessagePreview from "@/components/MessagePreview";

interface FormState {
  subject: string;
  template: string;
  recipientName: string;
  contactMethod: 'email' | 'instagram';
}

const Index = () => {
  const [formState, setFormState] = useState<FormState>({
    subject: "",
    template: "Dear {name},\n\nI am writing to express my concern about...",
    recipientName: "",
    contactMethod: 'email'
  });

  const handleFormUpdate = (data: Partial<FormState>) => {
    setFormState(prev => ({ ...prev, ...data }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
              Take Action for Change
            </h1>
            <p className="text-lg text-gray-600">
              Connect with decision makers through email or Instagram and make your voice heard
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <CampaignForm onFormUpdate={handleFormUpdate} />
            </div>

            <div className="space-y-6">
              <MessagePreview 
                template={formState.template}
                recipientName={formState.recipientName}
                subject={formState.subject}
                contactMethod={formState.contactMethod}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
