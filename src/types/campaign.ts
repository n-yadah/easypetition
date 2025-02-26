
export interface Recipient {
  id: string;
  name: string;
  position: string;
  email: string;
  instagram_handle: string | null;
  photo_url: string | null;
  description: string | null;
  created_at: string;
  phone_number?: string;
}

export interface FormData {
  subject: string;
  template: string;
  selectedRecipientId: string;
  contactMethod: 'email' | 'instagram' | 'phone';
  senderName: string;
}

export interface CampaignFormProps {
  onFormUpdate: (data: {
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
  }) => void;
}
