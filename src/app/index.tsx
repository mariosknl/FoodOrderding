import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import Button from "../components/Button";
import { Link, Redirect } from "expo-router";

import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/store";

const Index = () => {
  const { session, loading, profile } = useStore();

  if (loading) {
    return <ActivityIndicator />;
  }

  console.log("no session");
  if (!session) {
    return <Redirect href={"/welcome"} />;
  }

  if (profile?.group !== "ADMIN") {
    return <Redirect href={"/(user)"} />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
      <Link href={"/(user)"} asChild>
        <Button text="User" />
      </Link>
      <Link href={"/(admin)"} asChild>
        <Button text="Admin" />
      </Link>

      <Button onPress={() => supabase.auth.signOut()} text="Sign out" />
    </View>
  );
};

export default Index;
