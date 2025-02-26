
import { Button } from "@/components/ui/button";
import { Mail, Instagram, Phone } from "lucide-react";

interface ContactMethodSelectorProps {
  selectedMethod: 'email' | 'instagram' | 'phone';
  onMethodChange: (method: 'email' | 'instagram' | 'phone') => void;
}

export function ContactMethodSelector({
  selectedMethod,
  onMethodChange
}: ContactMethodSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Select Contact Method</label>
      <div className="flex gap-4">
        <Button
          type="button"
          variant={selectedMethod === 'phone' ? 'default' : 'outline'}
          className="flex-1 flex items-center justify-center gap-2"
          onClick={() => onMethodChange('phone')}
        >
          <Phone className="w-4 h-4" />
          Phone
        </Button>
        <Button
          type="button"
          variant={selectedMethod === 'email' ? 'default' : 'outline'}
          className="flex-1 flex items-center justify-center gap-2"
          onClick={() => onMethodChange('email')}
        >
          <Mail className="w-4 h-4" />
          Email
        </Button>
        <Button
          type="button"
          variant={selectedMethod === 'instagram' ? 'default' : 'outline'}
          className="flex-1 flex items-center justify-center gap-2"
          onClick={() => onMethodChange('instagram')}
        >
          <Instagram className="w-4 h-4" />
          Instagram
        </Button>
      </div>
    </div>
  );
}
