
import { Card } from "@/components/ui/card";

interface RecipientCardProps {
  name: string;
  position: string;
  description: string;
  photoUrl: string;
}

export default function RecipientCard({
  name,
  position,
  description,
  photoUrl
}: RecipientCardProps) {
  return (
    <Card className="p-6 bg-white shadow-sm border animate-slideIn">
      <div className="flex items-start gap-4">
        <img
          src={photoUrl}
          alt={name}
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-600 mb-2">{position}</p>
          <p className="text-sm text-gray-700">{description}</p>
        </div>
      </div>
    </Card>
  );
}
