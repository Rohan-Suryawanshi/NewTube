"use client";

import {
   SidebarContent,
   SidebarGroup,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@clerk/clerk-react";
import { useClerk } from "@clerk/nextjs";
import { FlameIcon, HomeIcon, PlaySquareIcon } from "lucide-react";
import Link from "next/link";

const items = [
   {
      title: "Home",
      url: "/",
      icons: HomeIcon,
   },
   {
      title: "Subscriptions",
      url: "/feed/subscriptions",
      icons: PlaySquareIcon,
      auth: true,
   },
   {
      title: "Trending",
      url: "/feed/trending",
      icons: FlameIcon,
   },
];
const MainSection = () => {
   const clerk=useClerk();
   const {isSignedIn}=useAuth();
   return (
      <SidebarGroup>
         <SidebarContent>
            <SidebarMenu>
               {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                     <SidebarMenuButton
                        tooltip={item.title}
                        asChild
                        isActive={false} // TODO: You can implement active state logic here
                        onClick={(e) => {
                           if(!isSignedIn&&item.auth)
                           {
                              e.preventDefault();
                              clerk.openSignIn()
                           }
                        }} //TODO: Placeholder for onClick handler
                     >
                        <Link
                           href={item.url}
                           className="flex items-center gap-4"
                        >
                           <item.icons />
                           <span className="text-sm">{item.title}</span>
                        </Link>
                     </SidebarMenuButton>
                  </SidebarMenuItem>
               ))}
            </SidebarMenu>
         </SidebarContent>
      </SidebarGroup>
   );
};

export default MainSection;
