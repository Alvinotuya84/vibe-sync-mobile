import React from "react";
import useUserStore from "@/stores/user.store";
import { Redirect } from "expo-router";

type Props = {};

const RedirectRouter = (props: Props) => {
  const { user } = useUserStore();

  if (user) return <Redirect href={"/(tabs)"} />;
  else return <Redirect href={"/(auth)"} />;
};

export default RedirectRouter;
