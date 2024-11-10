import { useTheme } from "@/hooks/useTheme.hook";
import Box from "./Box";
import ThemedText from "./ThemedText_New";

function ProfileStats({ stats }) {
  const theme = useTheme();
  return (
    <Box
      direction="row"
      justify="space-around"
      pa={15}
      radius={10}
      color={theme.surface}
    >
      {[
        { label: "Posts", value: stats?.totalPosts },
        { label: "Subscribers", value: stats?.subscribers },
        { label: "Gigs", value: stats?.totalGigs },
      ].map((item) => (
        <Box key={item.label} align="center">
          <ThemedText fontWeight="bold" size="lg">
            {item.value || 0}
          </ThemedText>
          <ThemedText size="sm" color={theme.lightText}>
            {item.label}
          </ThemedText>
        </Box>
      ))}
    </Box>
  );
}

export default ProfileStats;
