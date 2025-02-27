
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

  // Get direct image URL based on recipient name
  let displayImage = photoUrl;
  
  // Direct image URLs for specific recipients - these are reliable sources
  if (name === "Sara Jacobs") {
    displayImage = "https://jacobs.house.gov/sites/evo-subsites/jacobs.house.gov/files/evo-media-image/Jacobs_OfficialPhoto.jpg";
  } else if (name === "Ted Cruz") {
    displayImage = "https://www.cruz.senate.gov/wp-content/uploads/2021/09/Ted_Cruz_Official_Portrait_2021.jpg";
  } else if (name === "Nancy Pelosi") {
    displayImage = "https://pelosi.house.gov/sites/evo-subsites/pelosi.house.gov/files/evo-media-image/Pelosi_21-1.jpg";
  } else if (name === "Chuck Schumer") {
    displayImage = "https://www.schumer.senate.gov/imo/media/image/Official%20Schumer%20Portrait%20WHITE%20background%20small%20Print%20quality.jpg";
  } else if (name === "Mitch McConnell") {
    displayImage = "https://www.mcconnell.senate.gov/public/_cache/files/f/8/f8ce8199-1335-4833-82e5-d11760d2abed/396A03A3371D4D669804D8DC4E0CA94F.mcconnell-official-small.jpg";
  } else if (name === "Alexandria Ocasio-Cortez") {
    displayImage = "https://ocasio-cortez.house.gov/sites/evo-subsites/ocasio-cortez.house.gov/files/evo-media-image/aoc_official.jpg";
  } else if (name === "Hakeem Jeffries") {
    displayImage = "https://jeffries.house.gov/sites/evo-subsites/jeffries.house.gov/files/evo-media-image/rep.-jeffries-official-photo-116th-congress.jpg";
  } else if (name === "Kevin McCarthy") {
    displayImage = "https://www.govinfo.gov/content/pkg/GPO-PICTDIR-118/pdf/GPO-PICTDIR-118-45.pdf"; // This is a PDF, less ideal
  } else if (name === "Bernie Sanders") {
    displayImage = "https://www.sanders.senate.gov/wp-content/uploads/2021/02/Bernie_Sanders_Official_Photo.jpg";
  } else if (name === "Kamala Harris") {
    displayImage = "https://www.whitehouse.gov/wp-content/uploads/2021/01/kamala-harris_official-portrait-450x550.jpg";
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
