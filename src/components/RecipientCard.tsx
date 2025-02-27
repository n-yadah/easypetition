
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
  const [imageSrc, setImageSrc] = useState(photoUrl);
  // Using a generic avatar as fallback
  const fallbackImage = "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7";

  // Reset error state and update image source when photoUrl changes
  useEffect(() => {
    console.log(`Photo URL for ${name} changed to:`, photoUrl);
    
    // Handle specific recipients explicitly
    if (name === "Sara Jacobs") {
      setImageSrc("https://upload.wikimedia.org/wikipedia/commons/1/15/Representative_Sara_Jacobs_full_portrait.jpg");
    } else if (name === "Ted Cruz") {
      setImageSrc("https://upload.wikimedia.org/wikipedia/commons/a/a6/Ted_Cruz_senatorial_portrait.jpg");
    } else {
      setImageSrc(photoUrl);
    }
    
    setImageError(false);
  }, [photoUrl, name]);

  // Use the managed imageSrc with fallback
  const displayImageSrc = imageError || !imageSrc ? fallbackImage : imageSrc;
  
  console.log(`RecipientCard render for ${name} - Using image source:`, displayImageSrc);

  return (
    <Card className="p-6 bg-white shadow-sm border animate-slideIn">
      <div className="flex items-start gap-4">
        <img
          src={displayImageSrc}
          alt={`${name}'s photo`}
          className="w-24 h-24 rounded-lg object-cover bg-gray-100"
          onError={(e) => {
            console.error(`Image failed to load for ${name}:`, displayImageSrc);
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
