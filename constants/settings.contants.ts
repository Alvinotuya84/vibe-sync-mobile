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
    description: "Get a blue checkmark next to your name",
  },
  {
    id: 2,
    title: "Priority Support",
    description: "Get faster response from our support team",
  },
  {
    id: 3,
    title: "Extended Upload Limits",
    description: "Upload longer videos and higher quality content",
  },
  {
    id: 4,
    title: "Analytics Dashboard",
    description: "Access detailed insights about your content",
  },
  {
    id: 5,
    title: "Featured Content",
    description: "Get featured in the explore page",
  },
];
