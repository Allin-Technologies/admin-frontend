"use client";

import * as React from "react";
import {
  Banknote,
  GalleryVerticalEnd,
  Home,
  Settings2,
  LogIn,
  Ticket,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
// import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Session } from "next-auth";
import Image from "next/image";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Coupons",
          url: "/dashboard/coupons",
        },
      ],
      restricted: ["admin"],
    },
    {
      title: "Tickets",
      url: "/dashboard/tickets",
      icon: Ticket,
      isActive: true,
      items: [
        {
          title: "Purchases",
          url: "/dashboard/tickets/purchases",
        },
        {
          title: "Types",
          url: "/dashboard/tickets",
        },
      ],
      restricted: ["admin"],
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: Banknote,
      items: [
        {
          title: "Overview",
          url: "/dashboard/transactions",
        },
      ],
      restricted: ["admin"],
    },
    {
      title: "Checkin",
      url: "/dashboard/checkins",
      icon: LogIn,
      items: [
        {
          title: "QR Scan",
          url: "/dashboard/checkins/scan",
        },
        {
          title: "Search",
          url: "/dashboard/checkins",
        },
      ],
      restricted: ["admin", "agent"],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Support",
          url: "mailto:tickets@lifewithallin.com",
        },
      ],
      restricted: ["admin", "agent"],
    },
  ],
};

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & { session: Session }) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <div className='p-2'>
          <Image
            src='/Logos-07.svg'
            alt=''
            width={100}
            height={100}
            className='object-contain object-center size-14'
          />
        </div>

        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain role={props.session.user.role ?? ""} items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {props.session.user && (
          <NavUser
            user={{
              name: props.session.user.name ?? "",
              email: props.session.user.email ?? "",
              avatar: props.session.user.image,
            }}
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
