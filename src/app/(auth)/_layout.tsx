import { useStore } from "@/store/store";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { session } = useStore();

  if (session) {
    return <Redirect href="/" />;
  }

  return (
    <Stack initialRouteName="welcome">
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
    </Stack>
  );
}
