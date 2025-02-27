
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";

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
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(photoUrl);
  // Using a generic avatar as fallback
  const fallbackImage = "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7";

  useEffect(() => {
    setImageError(false);
    setCurrentPhotoUrl(photoUrl);
  }, [photoUrl]);

  console.log('RecipientCard render - Current photo URL:', currentPhotoUrl);

  return (
    <Card className="p-6 bg-white shadow-sm border animate-slideIn">
      <div className="flex items-start gap-4">
        <img
          src={imageError ? fallbackImage : currentPhotoUrl}
          alt={`${name}'s photo`}
          className="w-24 h-24 rounded-lg object-cover bg-gray-100"
          onError={(e) => {
            console.error('Image failed to load:', currentPhotoUrl);
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
