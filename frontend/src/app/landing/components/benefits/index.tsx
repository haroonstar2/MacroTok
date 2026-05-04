import { LucideIcon } from "lucide-react";

// Benefit Section Heading
export function BenefitsSectionHeading() {
  return (
    <h2 className="text-white mb-16 text-center">
      Why meal planning matters
    </h2>
  );
}

// Benefit Card Image
export function BenefitCardImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-64 object-cover rounded-lg"
    />
  );
}

// Benefit Card Heading
export function BenefitCardHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-white mb-3">{children}</h3>
  );
}

// Benefit Card Description
export function BenefitCardDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-slate-300">{children}</p>
  );
}

// Benefit Card (composite component)
export function BenefitCard({ 
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
    <div className="bg-slate-700/50 rounded-2xl overflow-hidden border border-slate-600">
      <BenefitCardImage src={imageSrc} alt={imageAlt} />
      <div className="p-8">
        <BenefitCardHeading>{heading}</BenefitCardHeading>
        <BenefitCardDescription>{description}</BenefitCardDescription>
      </div>
    </div>
  );
}

// Benefit Icon Card
export function BenefitIconCard({ 
  icon: Icon, 
  heading, 
  description 
}: { 
  icon: LucideIcon; 
  heading: string; 
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="size-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h4 className="text-white mb-2">{heading}</h4>
      <p className="text-slate-300">{description}</p>
    </div>
  );
}
