import { CTAHeading } from "./CTAHeading";
import { CTADescription } from "./CTADescription";
import { CTAButton } from "./CTAButton";
import { GetStartedButton } from "./navigation/GetStartedButton";

export function CTASection() {
  return (
    <section
      id="cta"
      className="py-20 bg-gradient-to-br from-indigo-600 to-indigo-800"
    >
      <div className="max-w-4xl mx-auto px-8 text-center">
        <CTAHeading />
        <CTADescription />
        <div className="flex justify-center">
          {/* <CTAButton /> */}
          <GetStartedButton
            className="bg-white text-indigo-600 hover:bg-slate-100 text-lg px-8 py-6"
            children="Get Started Free"
          />
        </div>
      </div>
    </section>
  );
}
