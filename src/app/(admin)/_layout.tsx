import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs } from "expo-router";
import React from "react";

import { useClientOnlyValue } from "@components/useClientOnlyValue";
import Colors from "@constants/Colors";
import { useStore } from "@/store/store";

function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string;
}) {
	return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

/**
 * The `_layout.tsx` component under the `admin` folder serves as the main layout for the administrative side
 * of a food ordering app. This layout component is designed to provide a consistent structure and navigation
 * interface for various administrative screens, such as managing menu items, orders, and user accounts.
 *
 * Key features of the `admin` `_layout.tsx` include:
 * - A conditional redirect that ensures only users with an "ADMIN" role can access the administrative interface,
 *   enhancing security and role-based access control.
 * - A tab-based navigation system (`Tabs` from `expo-router`) that allows admins to easily switch between different
 *   administrative tasks. Each tab is associated with a specific administrative function, such as viewing and managing
 *   orders, editing the menu, or handling user accounts.
 * - Customizable tab icons and colors for a visually appealing and intuitive navigation experience. Icons are rendered
 *   using `FontAwesome`, and colors are managed via a centralized `Colors` module.
 * - Utilization of `useClientOnlyValue` hook to manage client-side specific values like `headerShown`, ensuring that
 *   certain UI elements are only rendered in the client environment.
 *
 * This layout component acts as a foundational UI element for the admin side, providing essential navigation and
 * access control functionalities to support efficient and secure management of the food ordering app.
 */
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
