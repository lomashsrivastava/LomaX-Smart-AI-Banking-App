"use client";

import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/sidebar";
import { CustomerSidebar } from "@/components/layout/customer-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon } from "lucide-react";

export function TopNav({ isCustomer = false }: { isCustomer?: boolean }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-16 items-center px-4 md:px-6 border-b border-white/10 dark:border-white/5 bg-white/10 dark:bg-black/30 backdrop-blur-md">
      {/* Mobile Sidebar */}
      <div className="md:hidden mr-4">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            }
          />
          <SheetContent side="left" className="p-0 w-72">
            {isCustomer ? <CustomerSidebar /> : <Sidebar />}
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1 flex items-center justify-between">
        <div className="hidden md:flex flex-1 items-center max-w-md relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search transactions, accounts..."
            className="w-full bg-slate-50 dark:bg-slate-900 border-none pl-9 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-full h-9"
          />
        </div>
        <div className="flex items-center space-x-4 ml-auto">
          <ThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none border-none ring-0">
              <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-slate-100 dark:ring-slate-800">
                <AvatarImage src="" alt="@user" />
                <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(isCustomer ? "/customer/profile" : "/profile")} className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </div>
  );
}
