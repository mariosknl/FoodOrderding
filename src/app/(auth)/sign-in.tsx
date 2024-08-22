import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import Button from "@components/Button";
import { Link, Stack } from "expo-router";
import { supabase } from "@/lib/supabase";
import Auth from "@/components/Auth";
import { AppleAuth } from "@/components/AppleAuth";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";

/**
 * The `SignInScreen` component within the `sign-in.tsx` file is a key part of the authentication flow in a food ordering app, designed
 * specifically for the user sign-in process. This screen provides a user-friendly interface for users to enter their login credentials
 * (typically an email address and password) and access their accounts. It is an essential component for ensuring secure and efficient
 * user access to the app.
 *
 * Key functionalities of the `SignInScreen` include:
 * - A form interface where users can input their email address and password. This form may also include validation to ensure that the
 *   input data meets specific criteria (e.g., valid email format, password complexity requirements).
 * - Options for users to toggle password visibility for ease of use.
 * - A sign-in button that triggers the authentication process based on the provided credentials. This process involves verifying the
 *   credentials against the app's backend or authentication service and handling success or failure outcomes appropriately.
 * - Links or buttons for users who have forgotten their password or who wish to create a new account, directing them to the respective
 *   screens or processes.
 * - Integration with third-party authentication services or social login options (e.g., Google, Facebook) to offer alternative sign-in
 *   methods.
 * - Feedback mechanisms, such as loading indicators during the authentication process and error messages for failed sign-in attempts,
 *   to enhance the user experience.
 *
 * This component plays a crucial role in the app's overall security and user management strategy by facilitating a secure and user-friendly
 * sign-in process.
 */
const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <Stack.Screen options={{ headerShown: false }} />

        <View className="relative w-full h-[250px]">
          <Image source={images.coffee} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-white font-JakartaSemibold absolute bottom-5 left-5">
            Καλωσήρθατε
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Email"
            placeholder="Καταχωρήστε το email σας"
            value={form.email}
            onChangeText={(value: string) => setForm({ ...form, email: value })}
            autoCapitalize="none"
            icon={icons.email}
          />

          <InputField
            label="Κωδικός πρόσβασης"
            placeholder="Καταχωρήστε τον κωδικό σας"
            value={form.password}
            onChangeText={(value: string) =>
              setForm({ ...form, password: value })
            }
            secureTextEntry
            autoCapitalize="none"
            icon={icons.lock}
          />

          <Button
            onPress={signInWithEmail}
            disabled={loading}
            text={loading ? "Είσοδος..." : "Είσοδος"}
          />
          <View className="flex flex-row justify-center items-center my-2 gap-x-3">
            <View className="flex-1 h-[1px] bg-general-100" />
            <Text>ή</Text>
            <View className="flex-1 h-[1px] bg-general-100" />
          </View>

          <View className="flex flex-row items-center justify-center">
            <Auth />
          </View>
          <Link
            href="/sign-up"
            className="text-md text-center  text-general-200 mt-10"
          >
            <Text>Δεν έχεις λογαριασμό? </Text>
            <Text className="text-primary-500">Δημιούργησε λογαριασμό</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignInScreen;
