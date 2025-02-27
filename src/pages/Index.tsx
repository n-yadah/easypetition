
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
    subject: "Urgent Call for Sanctions Against Rwanda to Protect U.S. Economic and National Security Interests",
    template: `Dear {name},

I am writing to urge your office to support a resolution imposing targeted sanctions against the Rwandan Defense Forces (RDF) and the M23 rebel group due to their destabilizing actions in the Democratic Republic of the Congo (DRC). They have killed more than 3,000 civilians in the span of two weeks and have captured two strategic cities in two of the most mineral rich provinces of the DRC. These activities threaten America's access to strategic minerals, including cobalt and other rare earth elements essential for industries across the United States.

Executive Order 13413, signed by Presidents Bush and Obama, provides a framework for holding accountable those who contribute to instability in the DRC. Strengthening and enforcing these sanctions against actors like the RDF and M23 will not only help dismantle the predatory system exploiting Congolese resources but also secure an ethical and stable supply chain for U.S. industries reliant on these critical materials.

A secure and transparent supply of cobalt, coltan and other strategic minerals is vital to multiple sectors, including clean energy, technology, defense, and advanced manufacturing. America depends on these materials for battery production, automotive manufacturing, aerospace, and military applications. Continued instability in the DRC, fueled by Rwandan-backed armed groups, threatens U.S. economic and national security interests.

I urge you to take decisive action in supporting sanctions and advocating for policies that reinforce U.S.-DRC relations and help bring peace to the region. Your leadership is crucial in ensuring that American industries are not left vulnerable to supply chain disruptions caused by Rwanda's military takeover of Congolese territory.

Thank you for your time and consideration. I look forward to your response.

Sincerely,
{sender}`,
    recipientName: "",
    senderName: "",
    contactMethod: 'email',
    selectedRecipient: null
  });

  const handleFormUpdate = (data: FormState) => {
    setFormState(prev => ({ ...prev, ...data }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 w-full">
      <div className="w-full px-2 md:px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2 leading-relaxed py-1">
              Save Congolese Lives
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Make your voice heard to help bring peace and stability to the DR Congo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
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
