import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import MobileNav from "./MobileNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/plan", label: "Plan" },
    { href: "/entrenamiento", label: "Entrenamiento" },
    { href: "/calendario", label: "Calendario" },
    { href: "/reglas", label: "Reglas" },
    { href: "/integracion", label: "iOS" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10 pb-20 md:pb-0">
      {/* Desktop Header */}
      <header className="hidden md:block fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <a className="font-serif text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
              La Dieta del Corral
            </a>
          </Link>
          
          <nav className="flex gap-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === item.href ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Header (Minimal) */}
      <header className="md:hidden fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border/40">
        <div className="flex h-14 items-center justify-center">
          <span className="font-serif text-lg font-bold tracking-tight">
            La Dieta del Corral
          </span>
        </div>
      </header>

      <main className="pt-20 md:pt-24 pb-8 container max-w-4xl mx-auto animate-in fade-in duration-700 slide-in-from-bottom-4 px-4">
        {children}
      </main>

      <MobileNav />

      <footer className="hidden md:block border-t border-border/40 py-8 mt-auto">
        <div className="container text-center text-sm text-muted-foreground font-serif italic">
          "No tengo nada que decidir porque ya decidí."
        </div>
      </footer>
    </div>
  );
}
