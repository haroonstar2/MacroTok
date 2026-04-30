import { Button } from "../ui/button";
import { GetStartedButton } from "../navigation/GetStartedButton";

export function HowItWorksButtons() {
  return (
    <div className="flex gap-4 mt-10">
      <GetStartedButton className="bg-slate-900 text-white hover:bg-slate-800" />
      {/* <Button variant="outline" className="border-slate-300">
        Learn More
      </Button> */}
    </div>
  );
}
