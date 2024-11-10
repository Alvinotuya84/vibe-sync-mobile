import React from "react";
import { FlashList } from "@shopify/flash-list";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import UserResultItem from "./UserResultItem";
import PostResultItem from "./PostResultItem";
import GigResultItem from "./GigResultItem";

export default function SearchResults({ results, searchType }) {
  if (!results || Object.values(results).every((arr) => arr.length === 0)) {
    return (
      <Box align="center" justify="center" height={200}>
        <ThemedText color="lightText">No results found</ThemedText>
      </Box>
    );
  }

  const getItems = () => {
    switch (searchType) {
      case "users":
        return results.users.map((user) => ({
          type: "user",
          data: user,
        }));
      case "posts":
        return results.posts.map((post) => ({
          type: "post",
          data: post,
        }));
      case "gigs":
        return results.gigs.map((gig) => ({
          type: "gig",
          data: gig,
        }));
      default:
        return [
          ...results.users.map((user) => ({ type: "user", data: user })),
          ...results.posts.map((post) => ({ type: "post", data: post })),
          ...results.gigs.map((gig) => ({ type: "gig", data: gig })),
        ];
    }
  };

  const renderItem = ({ item }) => {
    switch (item.type) {
      case "user":
        return <UserResultItem user={item.data} />;
      case "post":
        return <PostResultItem post={item.data} />;
      case "gig":
        return <GigResultItem gig={item.data} />;
      default:
        return null;
    }
  };

  return (
    <FlashList
      data={getItems()}
      renderItem={({ item, index }) => (
        <Box key={index}>{renderItem({ item })}</Box>
      )}
      estimatedItemSize={80}
      ItemSeparatorComponent={() => <Box height={10} />}
    />
  );
}
