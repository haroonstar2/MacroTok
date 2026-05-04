import { GetStartedButton } from "../navigation/GetStartedButton";

export function HeroStartButton() {
  const handleClick = () => {
    const element = document.querySelector("#cta");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <GetStartedButton
      className="bg-slate-900 hover:bg-slate-800 text-lg px-8 py-6"
      children="Start Planning"
    />
  );
}
