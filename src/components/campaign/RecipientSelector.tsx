
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Recipient {
  id: string;
  name: string;
  position: string;
  email: string;
  instagram_handle: string | null;
  photo_url: string | null;
  phone_number?: string;
}

interface RecipientSelectorProps {
  recipients: Recipient[];
  selectedRecipientId: string;
  onRecipientChange: (id: string) => void;
  contactMethod: 'email' | 'instagram' | 'phone';
}

export function RecipientSelector({
  recipients,
  selectedRecipientId,
  onRecipientChange,
  contactMethod
}: RecipientSelectorProps) {
  const filteredRecipients = recipients.filter(recipient => {
    switch (contactMethod) {
      case 'email':
        return recipient.email && recipient.email.trim() !== '';
      case 'instagram':
        return recipient.instagram_handle && recipient.instagram_handle.trim() !== '';
      case 'phone':
        return recipient.phone_number && recipient.phone_number.trim() !== '';
      default:
        return false;
    }
  });

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Select Recipient</label>
      <Select
        value={selectedRecipientId}
        onValueChange={onRecipientChange}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Choose a decision maker" />
        </SelectTrigger>
        <SelectContent>
          {filteredRecipients.map((recipient) => (
            <SelectItem key={recipient.id} value={recipient.id}>
              {recipient.name} - {recipient.position}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
