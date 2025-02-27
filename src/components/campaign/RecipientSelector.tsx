
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
  // Filter recipients based on contact method but don't exclude any recipient completely
  // This will show all recipients, but we'll differentiate which ones have valid contact info
  const filteredRecipients = recipients.map(recipient => {
    let hasContactInfo = false;
    switch (contactMethod) {
      case 'email':
        hasContactInfo = Boolean(recipient.email && recipient.email.trim() !== '');
        break;
      case 'instagram':
        hasContactInfo = Boolean(recipient.instagram_handle && recipient.instagram_handle.trim() !== '');
        break;
      case 'phone':
        hasContactInfo = Boolean(recipient.phone_number && recipient.phone_number.trim() !== '');
        break;
    }
    return { ...recipient, hasContactInfo };
  });

  // Debug output for troubleshooting
  console.log(`RecipientSelector: ${contactMethod} method selected`);
  console.log("Filtered recipients:", filteredRecipients.map(r => ({
    id: r.id,
    name: r.name,
    hasContactInfo: r.hasContactInfo,
    contactMethod
  })));

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
            <SelectItem 
              key={recipient.id} 
              value={recipient.id}
              disabled={!recipient.hasContactInfo}
              className={!recipient.hasContactInfo ? "opacity-50" : ""}
            >
              <div className="flex items-center">
                <span className="mr-2">🇺🇸</span>
                <span className="truncate max-w-[260px] inline-block">{recipient.name} - {recipient.position}</span>
                {!recipient.hasContactInfo && <span className="ml-1">(No contact info)</span>}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
