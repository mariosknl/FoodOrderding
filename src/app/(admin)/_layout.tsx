import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs } from "expo-router";
import React from "react";

import { useClientOnlyValue } from "@components/useClientOnlyValue";
import Colors from "@constants/Colors";
import { useStore } from "@/store/store";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string;
}) {
	return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
	const { profile } = useStore();

	if (profile?.group !== "ADMIN") {
		return <Redirect href={"/"} />;
	}

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.light.background,
				tabBarInactiveTintColor: "gainsboro",
				headerShown: useClientOnlyValue(false, true),
				tabBarStyle: {
					backgroundColor: Colors.light.tint,
				},
			}}
		>
			<Tabs.Screen name="index" options={{ href: null }} />

			<Tabs.Screen
				name="menu"
				options={{
					title: "Menu",
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="cutlery" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="orders"
				options={{
					title: "Orders",
					headerShown: false,
					tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
				}}
			/>
		</Tabs>
	);
}
