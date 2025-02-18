import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavLinks } from "./NavLinks";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onScrollToSection: (sectionId: string) => void;
}

export const MobileMenu = ({ isOpen, setIsOpen, onScrollToSection }: MobileMenuProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col space-y-6 mt-6">
          <NavLinks onScrollToSection={onScrollToSection} setIsOpen={setIsOpen} />
        </nav>
      </SheetContent>
    </Sheet>
  );
};
