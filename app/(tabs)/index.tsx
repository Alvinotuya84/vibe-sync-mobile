import { View, Text } from "react-native";
import React from "react";
import Page from "@/components/Page";
import ThemedButton from "@/components/ThemedButton";
import { router } from "expo-router";

type Props = {};

const Gigs = (props: Props) => {
  return (
    <Page>
      <Text>Gigs</Text>

      <ThemedButton onPress={() => router.push("/routes/settings")} />
    </Page>
  );
};

export default Gigs;
