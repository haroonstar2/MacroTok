import { MacroTokLogo } from "./MacroTokLogo";
import { NavLinks } from "./navigation/NavLinks";
import { GetStartedButton } from "./navigation/GetStartedButton";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <MacroTokLogo />
          <div className="flex items-center gap-8">
            <NavLinks />
            <GetStartedButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
