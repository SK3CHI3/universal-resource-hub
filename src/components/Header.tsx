
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavLinks } from "./navigation/NavLinks";
import { MobileMenu } from "./navigation/MobileMenu";
import { Logo } from "./Logo";
import { Moon, Sun, LogIn, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles } from "lucide-react";

export const Header = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { user, signOut, isAuthenticated, isPremium } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
    
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated`,
      duration: 1500,
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setIsOpen(false);
    } else {
      toast({
        title: "Section not found",
        description: "The requested section could not be found.",
        variant: "destructive",
      });
    }
  };

  const handleLoginClick = () => {
    navigate('/auth');
  };

  const handleProfileClick = () => {
    // For now just a placeholder, could navigate to a profile page
    toast({
      title: "Profile",
      description: "Profile page coming soon!",
    });
  };

  const handleSubscriptionClick = () => {
    navigate('/subscription');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl backdrop-blur-md bg-white/30 dark:bg-gray-900/30 z-50 rounded-2xl border border-gray-200/30 dark:border-gray-700/30 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          onClick={() => scrollToSection('hero')}
          className="cursor-pointer"
        >
          <Logo />
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5 text-gray-600 hover:text-gray-900" />
            ) : (
              <Sun className="h-5 w-5 text-gray-300 hover:text-white" />
            )}
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-10 w-10 p-0">
                  <UserCircle className="h-6 w-6" />
                  {isPremium && (
                    <span className="absolute -top-1 -right-1">
                      <Sparkles className="h-4 w-4 text-amber-400" />
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSubscriptionClick}>
                  {isPremium ? (
                    <span className="flex items-center">
                      <Sparkles className="mr-2 h-4 w-4 text-amber-400" />
                      Premium Active
                    </span>
                  ) : (
                    "Upgrade to Premium"
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="default" 
              onClick={handleLoginClick}
              className="flex items-center gap-2"
              size="sm"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          )}

          {isMobile ? (
            <MobileMenu 
              isOpen={isOpen} 
              setIsOpen={setIsOpen} 
              onScrollToSection={scrollToSection} 
            />
          ) : (
            <nav className="hidden md:flex items-center space-x-6">
              <NavLinks onScrollToSection={scrollToSection} />
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};
