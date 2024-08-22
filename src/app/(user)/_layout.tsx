import React from "react";
import { Redirect, Tabs } from "expo-router";
import { useStore } from "@/store/store";
import { View } from "react-native";
import { ImageSourcePropType } from "react-native";
import { Image } from "react-native";
import { icons } from "@/constants";

const TabBarIcon = ({
  focused,
  source,
}: {
  focused: boolean;
  source: ImageSourcePropType;
}) => (
  <View
    className={`flex flex-row justify-center items-center rounded-full ${focused ? "bg-general-300" : ""}`}
  >
    <View
      className={`rounded-full w-12 h-12 items-center justify-center ${focused ? "bg-general-400" : ""}`}
    >
      <Image
        source={source}
        tintColor="white"
        resizeMode="contain"
        className="w-7 h-7"
      />
    </View>
  </View>
);

export default function TabLayout() {
  const { session } = useStore();

  if (!session) {
    return <Redirect href={"/"} />;
  }

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#333333",
          borderRadius: 50,
          paddingBottom: 0, // ios only
          overflow: "hidden",
          marginHorizontal: 20,
          marginBottom: 20,
          height: 78,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          position: "absolute",
        },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />

      <Tabs.Screen
        name="menu"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon source={icons.home} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Παραγγελίες",
          headerShown: true,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon source={icons.list} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Προφίλ",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon source={icons.profile} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
