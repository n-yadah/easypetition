
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
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
}

interface FormData {
  subject: string;
  template: string;
  selectedRecipientId: string;
}

export default function CampaignForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    subject: "",
    template: "",
    selectedRecipientId: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.template || !formData.selectedRecipientId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement actual sending logic
    toast({
      title: "Message Created",
      description: "Your message has been created successfully!",
    });
  };

  const selectedRecipient = recipients.find(r => r.id === formData.selectedRecipientId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
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

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Select Recipient</label>
        <Select
          value={formData.selectedRecipientId}
          onValueChange={(value) => setFormData({ ...formData, selectedRecipientId: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a decision maker" />
          </SelectTrigger>
          <SelectContent>
            {recipients.map((recipient) => (
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
          className="w-full min-h-[200px]"
        />
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
        Send Message
      </Button>
    </form>
  );
}
