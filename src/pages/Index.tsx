
import CampaignForm from "@/components/CampaignForm";
import MessagePreview from "@/components/MessagePreview";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Mobilize & Make Change</h1>
            <p className="text-lg text-gray-600">Create powerful email campaigns to reach decision makers</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-2xl font-semibold mb-6">Create Campaign</h2>
              <CampaignForm />
            </div>

            <div className="space-y-6">
              <MessagePreview 
                template="Dear {name},\n\nI am writing to express my concern about..."
                recipientName="John Doe"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
