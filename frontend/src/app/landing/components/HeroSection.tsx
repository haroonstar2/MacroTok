import { HeroHeading } from "./hero/HeroHeading";
import { HeroDescription } from "./hero/HeroDescription";
import { HeroStartButton } from "./hero/HeroStartButton";
import { HeroImageSlideshow } from "./HeroImageSlideshow";

export function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-20">
      <div className="mb-12">
        <HeroHeading />
        <HeroDescription />
        <HeroStartButton />
      </div>
      <HeroImageSlideshow />
    </section>
  );
}
