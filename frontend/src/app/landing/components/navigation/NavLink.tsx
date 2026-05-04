export function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <a href={href} onClick={onClick} className="text-slate-200 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
      {children}
    </a>
  );
}
