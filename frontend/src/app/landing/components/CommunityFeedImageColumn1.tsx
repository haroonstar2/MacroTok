export function CommunityFeedImageColumn1() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1520075280578-af753d79a061?w=800&q=80"
          alt="Food photography"
          className="w-full h-[400px] object-cover"
        />
      </div>
      <div className="rounded-2xl overflow-hidden shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1597676718706-a87e84aaa8e5?w=800&q=80"
          alt="Recipe ingredients"
          className="w-full h-[300px] object-cover"
        />
      </div>
    </div>
  );
}
