import { NavLink } from "react-router-dom";

const links = [
  { to: "/hide", label: "Hide" },
  { to: "/extract", label: "Extract" },
  { to: "/about", label: "About" },
];

function linkClasses({ isActive }) {
  return [
    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
    isActive ? "text-text bg-surface-raised" : "text-text-muted hover:text-text hover:bg-surface-hover",
  ].join(" ");
}

export default function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-base/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6" aria-label="Primary">
        <NavLink to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-text">
          <img src="/favicon.svg" alt="" aria-hidden="true" className="h-6 w-6" />
          StegoArt
        </NavLink>
        <div className="flex items-center gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClasses}>
              {l.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
