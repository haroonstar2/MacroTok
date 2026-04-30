import { CommunityFeedImageColumn1 } from "./CommunityFeedImageColumn1";
import { CommunityFeedImageColumn2 } from "./CommunityFeedImageColumn2";

export function CommunityFeedImages() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <CommunityFeedImageColumn1 />
      <CommunityFeedImageColumn2 />
    </div>
  );
}
