import { View, Text, Alert, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import Button from "@components/Button";
import { Link } from "expo-router";
import { supabase } from "@/lib/supabase";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import Auth from "@/components/Auth";

/**
 * SignUpScreen is a React component that renders a sign-up form for users to create an account.
 * It uses React Native components for layout and styling, and integrates with Supabase for authentication.
 *
 * @component
 * @example
 * return <SignUpScreen />
 */
const SignUpScreen = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.coffee} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-white font-JakartaSemibold absolute bottom-5 left-5">
            Δημιουργία λογαριασμού
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
            text={loading ? "Δημιουργία..." : "Δημιουργία"}
            onPress={signUpWithEmail}
            disabled={loading}
          />
          <View className="flex flex-row justify-center items-center my-2 gap-x-3">
            <View className="flex-1 h-[1px] bg-general-100" />
            <Text>ή</Text>
            <View className="flex-1 h-[1px] bg-general-100" />
          </View>

          <View className="flex flex-row items-center justify-center">
            <Auth />
          </View>
        </View>

        <Link
          href="/sign-in"
          className="text-lg text-center text-general-200 mt-10"
        >
          <Text>Έχεις ήδη λογαριασμό? </Text>
          <Text className="text-primary-500">Είσοδος</Text>
        </Link>
      </View>
    </ScrollView>
  );
};

export default SignUpScreen;
