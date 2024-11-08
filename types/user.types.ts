export interface UserDetailsResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    username: string;
    email: string;
    profileImagePath: string | null;
    isVerified: boolean;
    accountType: string;
    bio: string | null;
    location: string | null;
    website: string | null;
  };
}
