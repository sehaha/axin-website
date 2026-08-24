"use client";

import { useEffect, useState } from "react";

const links = [
  ["About", "group"],
  ["Technology", "technology"],
  ["Capital", "ecosystem"],
  ["Global Services", "global"],
] as const;

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 40);
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <header className={`navigation ${scrolled ? "navigation--scrolled" : ""}`}>
      <a href="#home" className="wordmark" aria-label="AXIN home">AXIN</a>
      <nav aria-label="Primary navigation">
        {links.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}
      </nav>
      <a className="nav-contact" href="#contact">Contact <span aria-hidden="true">↗</span></a>
    </header>
  );
}
