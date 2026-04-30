import { NavLink } from "./NavLink";

export function NavLinks() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex items-center gap-8">
      <NavLink href="#features" onClick={(e) => handleClick(e, '#features')}>Features</NavLink>
      <NavLink href="#how-it-works" onClick={(e) => handleClick(e, '#how-it-works')}>How It Works</NavLink>
      <NavLink href="#about" onClick={(e) => handleClick(e, '#about')}>About</NavLink>
    </div>
  );
}
