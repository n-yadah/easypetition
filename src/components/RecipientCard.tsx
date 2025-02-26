
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
  // Using a generic avatar as fallback
  const fallbackImage = "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7";

  console.log('Attempting to load image:', photoUrl);

  return (
    <Card className="p-6 bg-white shadow-sm border animate-slideIn">
      <div className="flex items-start gap-4">
        <img
          src={imageError ? fallbackImage : "https://upload.wikimedia.org/wikipedia/commons/8/87/Ted_Cruz%2C_official_portrait%2C_113th_Congress.jpg"}
          alt={`${name}'s photo`}
          className="w-24 h-24 rounded-lg object-cover bg-gray-100"
          onError={(e) => {
            console.log('Image failed to load, using fallback:', photoUrl);
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
