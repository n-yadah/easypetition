
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface CampaignFormData {
  title: string;
  template: string;
  recipients: string[];
}

export default function CampaignForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CampaignFormData>({
    title: "",
    template: "",
    recipients: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.template || formData.recipients.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement actual sending logic
    toast({
      title: "Campaign Created",
      description: "Your campaign has been created successfully!",
    });
  };

  const handleRecipientsChange = (value: string) => {
    const recipients = value.split(",").map((email) => email.trim());
    setFormData({ ...formData, recipients });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Campaign Title</label>
        <Input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter campaign title"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Message Template</label>
        <Textarea
          value={formData.template}
          onChange={(e) => setFormData({ ...formData, template: e.target.value })}
          placeholder="Enter your message template. Use {name} for recipient name placeholder"
          className="w-full min-h-[200px]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Recipients</label>
        <Textarea
          onChange={(e) => handleRecipientsChange(e.target.value)}
          placeholder="Enter recipient emails, separated by commas"
          className="w-full"
        />
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
        Create Campaign
      </Button>
    </form>
  );
}
