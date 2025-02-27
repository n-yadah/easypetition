
import { Card } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";

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
  const [imageSrc, setImageSrc] = useState('');
  const initialRenderDone = useRef(false);
  
  // Using a generic avatar as fallback
  const fallbackImage = "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7";

  // Hard-coded image mapping for specific recipients
  const getImageForRecipient = (recipientName: string) => {
    const imageMap: Record<string, string> = {
      "Sara Jacobs": "https://upload.wikimedia.org/wikipedia/commons/1/15/Representative_Sara_Jacobs_full_portrait.jpg",
      "Ted Cruz": "https://upload.wikimedia.org/wikipedia/commons/a/a6/Ted_Cruz_senatorial_portrait.jpg"
    };
    
    return imageMap[recipientName] || photoUrl;
  };

  // Initialize image source on mount and when props change
  useEffect(() => {
    console.log(`RecipientCard: Setting up image for ${name}. Photo URL:`, photoUrl);
    const correctImageSrc = getImageForRecipient(name);
    console.log(`RecipientCard: Using image source for ${name}:`, correctImageSrc);
    setImageSrc(correctImageSrc);
    setImageError(false);
    initialRenderDone.current = true;
  }, [name, photoUrl]);

  // Use the managed imageSrc with fallback
  const displayImageSrc = !initialRenderDone.current || imageError || !imageSrc ? fallbackImage : imageSrc;
  
  console.log(`RecipientCard render for ${name} - Final image source:`, displayImageSrc);

  return (
    <Card className="p-6 bg-white shadow-sm border animate-slideIn">
      <div className="flex items-start gap-4">
        <img
          key={`${name}-${displayImageSrc}`} // Force re-render of image when source changes
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
