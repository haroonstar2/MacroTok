import { Zap, Shield, CheckCircle } from "lucide-react";
import { BenefitsSectionHeading, BenefitCard, BenefitIconCard } from "./benefits";

export function BenefitsSection() {
  return (
    <section id="about" className="bg-gradient-to-br from-slate-800 to-slate-900 py-20 text-white">
      <div className="max-w-7xl mx-auto px-8">
        <BenefitsSectionHeading />

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <BenefitCard
            imageSrc="https://images.unsplash.com/photo-1599200119031-ec980e398c76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2Zhc3QlMjB0YWJsZSUyMGZvb2R8ZW58MXx8fHwxNzYxMDIwMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            imageAlt="Breakfast table"
            heading="Stay Consistent"
            description="Planning ahead removes daily decision fatigue. Know exactly what you're eating and when, making it easier to stick to your nutrition goals."
          />

          <BenefitCard
            imageSrc="https://images.unsplash.com/photo-1644704170910-a0cdf183649b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMGJvd2wlMjB2ZWdldGFibGVzfGVufDF8fHx8MTc2MTAxOTY1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            imageAlt="Healthy food bowl"
            heading="Hit Your Macros"
            description="Distribute your protein, carbs, and fats throughout the week. See your macro totals and adjust your plan before the week starts."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <BenefitIconCard
            icon={Zap}
            heading="Save Time"
            description="Plan once, execute all week. No more daily meal decisions or last-minute scrambling."
          />

          <BenefitIconCard
            icon={Shield}
            heading="Build Habits"
            description="Consistent meal timing helps establish healthy eating patterns that last."
          />

          <BenefitIconCard
            icon={CheckCircle}
            heading="Track Progress"
            description="See your weekly nutrition at a glance and make informed adjustments."
          />
        </div>
      </div>
    </section>
  );
}