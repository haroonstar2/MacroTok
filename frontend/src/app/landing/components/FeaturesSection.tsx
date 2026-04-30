import { FeaturesSectionHeading } from "./features/FeaturesSectionHeading";
import { FeatureCard } from "./features/FeatureCard";

export function FeaturesSection() {
  return (
    <section id="features" className="bg-white/50 backdrop-blur-sm py-20">
      <div className="max-w-7xl mx-auto px-8">
        <FeaturesSectionHeading />

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            imageSrc="https://images.unsplash.com/photo-1617131633412-39437b40a16b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwY2FsZW5kYXIlMjBzY2hlZHVsZXxlbnwxfHx8fDE3NjEwMjAxNjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            imageAlt="Weekly calendar"
            heading="Weekly Calendar View"
            description="Organize your meals from Monday to Sunday with a clear, intuitive calendar interface. See your entire week at a glance."
          />
          
          <FeatureCard
            imageSrc="https://images.unsplash.com/photo-1622296620653-6f431117c62d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm90ZWluJTIwbWVhbCUyMGJvd2x8ZW58MXx8fHwxNzYxMDIwMTY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            imageAlt="Protein meal bowl"
            heading="Hourly Time Slots"
            description="Schedule your meals throughout the day with precise hourly time slots. Perfect for meal timing and macro distribution."
          />
          
          <FeatureCard
            imageSrc="https://images.unsplash.com/photo-1597317292822-d0fa5be43aea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWFsJTIwcHJlcCUyMGNvbnRhaW5lcnMlMjB3ZWVrbHl8ZW58MXx8fHwxNzYxMDIwMTY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            imageAlt="Meal prep containers"
            heading="Favorite Meals Library"
            description="Save your go-to high-protein meals and quickly add them to your calendar. Build your personal recipe collection."
          />
        </div>
      </div>
    </section>
  );
}
