import { Calendar, Clock, Utensils } from "lucide-react";
import { HowItWorksHeading } from "./how-it-works/HowItWorksHeading";
import { HowItWorksFeatureItem } from "./how-it-works/HowItWorksFeatureItem";
import { HowItWorksButtons } from "./how-it-works/HowItWorksButtons";
import { HowItWorksImage } from "./how-it-works/HowItWorksImage";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <HowItWorksHeading />

            <div className="space-y-7">
              <HowItWorksFeatureItem
                icon={Calendar}
                heading="Monday to Sunday Layout"
                description="Plan every day of your week with a dedicated space for each meal. Visualize your entire nutrition week in one view."
              />

              <HowItWorksFeatureItem
                icon={Clock}
                heading="Hour-by-Hour Scheduling"
                description="Add meals to specific time slots throughout the day. Perfect for tracking breakfast, lunch, dinner, and snacks with precise timing."
              />

              <HowItWorksFeatureItem
                icon={Utensils}
                heading="Drag & Drop Favorites"
                description="Simply drag your favorite meals from your library and drop them into any time slot. Meal planning has never been easier."
              />
            </div>

            <HowItWorksButtons />
          </div>

          <HowItWorksImage />
        </div>
      </div>
    </section>
  );
}
