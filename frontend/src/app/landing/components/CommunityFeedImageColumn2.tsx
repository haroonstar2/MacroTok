import { CommunityFeedImageColumn2Top } from "./CommunityFeedImageColumn2Top";
import { CommunityRecipeCard } from "./CommunityRecipeCard";

export function CommunityFeedImageColumn2() {
  return (
    <div className="space-y-4 pt-12">
      <CommunityFeedImageColumn2Top />
      <CommunityRecipeCard />
    </div>
  );
}
