import { View, Text } from "react-native";
import React from "react";
import Page from "@/components/Page";
import ThemedButton from "@/components/ThemedButton";
import { router } from "expo-router";
import ThemedMainHeader from "@/components/ThemedMainHeader";
import Box from "@/components/Box";

type Props = {};

const Gigs = (props: Props) => {
  return (
    <Page
      header={{
        rightComponent: (
          <Box pr={50}>
            <ThemedMainHeader
              showBackButton={false}
              rightComponent={
                <Box direction="row" gap={10}>
                  <ThemedButton type="text" icon={{ name: "heart" }} />
                  <ThemedButton
                    type="text"
                    icon={{ name: "search" }}
                    onPress={() => {
                      /* Handle search */
                    }}
                  />
                </Box>
              }
            />
          </Box>
        ),
      }}
    >
      <Text>Gigs</Text>

      <ThemedButton onPress={() => router.push("/routes/settings")} />
    </Page>
  );
};

export default Gigs;
