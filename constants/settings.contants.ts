import { SettingsSection } from "@/types/settings.types";

export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: "profile",
    title: "Edit Profile",
    description: "Manage your personal information",
    icon: "user",
    route: "/routes/settings/edit-profile",
  },
  {
    id: "verification",
    title: "Account Verification",
    description: "Verify your account to unlock premium features",
    icon: "check-circle",
    route: "/routes/settings/verification",
  },
  {
    id: "appearance",
    title: "Appearance",
    description: "Customize your app theme",
    icon: "eye",
    route: "/routes/settings/appearance",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Manage your notification preferences",
    icon: "bell",
    route: "/settings/notifications",
  },
  {
    id: "privacy",
    title: "Privacy & Security",
    description: "Control your privacy settings",
    icon: "lock",
    route: "/settings/privacy",
  },
  {
    id: "help",
    title: "Help & Support",
    description: "Get help with using the app",
    icon: "help-circle",
    route: "/settings/help",
  },
];

export const VERIFICATION_BENEFITS = [
  {
    id: 1,
    title: "Verified Badge",
    description: "Stand out with a distinctive verification badge",
    icon: "check-circle",
    color: "#4CAF50",
  },
  {
    id: 2,
    title: "Priority Support",
    description: "Get 24/7 priority customer support",
    icon: "headphones",
    color: "#2196F3",
  },
  {
    id: 3,
    title: "Advanced Analytics",
    description: "Access detailed content performance metrics",
    icon: "bar-chart-2",
    color: "#9C27B0",
  },
  {
    id: 4,
    title: "Extended Upload Limits",
    description: "Upload longer videos (up to 60 minutes)",
    icon: "upload",
    color: "#FF9800",
  },
  {
    id: 5,
    title: "Featured Content",
    description: "Get priority in recommendations",
    icon: "star",
    color: "#F44336",
  },
];

export const VERIFICATION_STATS = [
  {
    title: "Average Engagement",
    increase: "+150%",
    description: "Higher engagement rate than non-verified",
  },
  {
    title: "Reach",
    increase: "+200%",
    description: "Increased content visibility",
  },
  {
    title: "Trust Score",
    increase: "+180%",
    description: "Higher trust from community",
  },
];
