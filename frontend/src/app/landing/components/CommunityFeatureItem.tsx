import { LucideIcon } from "lucide-react";

export function CommunityFeatureItem({ 
  icon: Icon, 
  heading, 
  description 
}: { 
  icon: LucideIcon; 
  heading: string; 
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="size-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <div>
        <h4 className="text-slate-900 mb-2">{heading}</h4>
        <p className="text-slate-600">{description}</p>
      </div>
    </div>
  );
}
