import { Utensils, CheckCircle, Calendar } from "lucide-react";
import { CommunityHeading } from "./community/CommunityHeading";
import { CommunityFeatureItem } from "./CommunityFeatureItem";
import { CommunityFeedImages } from "./CommunityFeedImages";

export function CommunityFeedSection() {
  return (
    <section className="py-20 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <CommunityFeedImages />
          </div>

          <div className="order-1 lg:order-2">
            <CommunityHeading />
            
            <div className="space-y-6">
              <CommunityFeatureItem
                icon={Utensils}
                heading="Browse the Feed"
                description="Scroll through beautiful photos and short videos of finished meals created by other users. Get inspired by real food from real people."
              />

              <CommunityFeatureItem
                icon={CheckCircle}
                heading="Swipe for Recipes"
                description="See a meal you love? Simply swipe up on any photo or video to reveal the full recipe card with step-by-step instructions."
              />

              <CommunityFeatureItem
                icon={Calendar}
                heading="View Macros & Add to Calendar"
                description="Every recipe card shows complete macro breakdowns—protein, carbs, and fats. Love it? Add it directly to your weekly meal calendar."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
