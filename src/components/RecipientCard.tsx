
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Instagram } from "lucide-react";

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

  // Get direct image URL based on recipient name
  let displayImage = photoUrl;
  
  // Direct image URLs for specific recipients - these are reliable sources
  if (name === "Sara Jacobs") {
    displayImage = "https://www.congress.gov/img/member/j000305_200.jpg";
  } else if (name === "Ted Cruz") {
    displayImage =  "https://www.congress.gov/img/member/c001098_200.jpg";
  } else if (name === "Chris Smith") {
    displayImage = "https://www.congress.gov/img/member/s000522_200.jpg";
  } else if (name === "Cory Booker") {
    displayImage = "https://www.congress.gov/img/member/b001288_200.jpg";
  }
  
  // Use fallback if there's an error
  const finalImageUrl = imageError ? fallbackImage : displayImage;
  
  console.log(`RecipientCard for ${name}: Using image source:`, finalImageUrl);

  return (
    <Card className="p-6 bg-white shadow-sm border animate-slideIn">
      <div className="flex items-start gap-4">
        <img
          src={finalImageUrl}
          alt={`${name}'s photo`}
          className="w-24 h-24 rounded-lg object-cover bg-gray-100"
          onError={() => {
            console.error(`Image failed to load for ${name}, using fallback`);
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
