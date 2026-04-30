import { FeatureCardImage } from "./FeatureCardImage";
import { FeatureCardHeading } from "./FeatureCardHeading";
import { FeatureCardDescription } from "./FeatureCardDescription";

export function FeatureCard({ 
  imageSrc, 
  imageAlt, 
  heading, 
  description 
}: { 
  imageSrc: string; 
  imageAlt: string; 
  heading: string; 
  description: string;
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
      <FeatureCardImage src={imageSrc} alt={imageAlt} />
      <div className="p-8">
        <FeatureCardHeading>{heading}</FeatureCardHeading>
        <FeatureCardDescription>{description}</FeatureCardDescription>
      </div>
    </div>
  );
}
