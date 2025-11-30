import { Link, useLocation } from "wouter";
import { Home, Calendar, Dumbbell, BookOpen, CheckSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Hoy" },
    { href: "/plan", icon: BookOpen, label: "Plan" },
    { href: "/entrenamiento", icon: Dumbbell, label: "Entreno" },
    { href: "/calendario", icon: Calendar, label: "Días" },
    { href: "/integracion", icon: Settings, label: "iOS" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/40 pb-safe pt-2 px-4 z-50 md:hidden">
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a className={cn(
                "flex flex-col items-center justify-center w-14 gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
              )}>
                <item.icon className={cn("h-6 w-6", isActive && "fill-current")} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
