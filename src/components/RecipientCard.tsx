
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface RecipientCardProps {
  name: string;
  position: string;
  photoUrl: string;
}

export default function RecipientCard({
  name,
  position,
  photoUrl
}: RecipientCardProps) {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843"; // Nature fallback image

  console.log('Image URL received:', photoUrl); // Debug log

  return (
    <Card className="p-6 bg-white shadow-sm border animate-slideIn">
      <div className="flex items-start gap-4">
        <img
          src={imageError ? fallbackImage : photoUrl}
          alt={`${name}'s photo`}
          className="w-24 h-24 rounded-lg object-cover bg-gray-100"
          onError={(e) => {
            console.log('Image failed to load:', photoUrl); // Debug log
            setImageError(true);
          }}
        />
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-600">{position}</p>
        </div>
      </div>
    </Card>
  );
}
