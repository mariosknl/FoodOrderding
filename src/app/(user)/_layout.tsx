import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Redirect, Tabs, useNavigation, usePathname } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import Colors from "@constants/Colors";
import { useColorScheme } from "@components/useColorScheme";
import { useClientOnlyValue } from "@components/useClientOnlyValue";
import { useAuth } from "../providers/AuthProvider";
import { useBasketStore } from "@/store/basketStore";
import { SafeAreaView } from "react-native-safe-area-context";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string;
}) {
	return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
	const colorScheme = useColorScheme();
	const { session } = useAuth();
	const { items, total } = useBasketStore();
	const pathname = usePathname();
	const navigation = useNavigation();

	if (!session) {
		return <Redirect href={"/"} />;
	}

	return (
		<>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
					// Disable the static render of the header on web
					// to prevent a hydration error in React Navigation v6.
					headerShown: useClientOnlyValue(false, true),
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

				<Tabs.Screen
					name="profile"
					options={{
						title: "Profile",
						tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
					}}
				/>
			</Tabs>
			{/* Footer Basket */}
			{items > 0 && pathname !== "/cart" && (
				<View style={styles.footer}>
					<SafeAreaView edges={["bottom"]}>
						<Link href="/cart" asChild>
							<Pressable style={styles.fullButton}>
								<Text style={styles.basket}>{items}</Text>
								<Text style={styles.footerText}>Δες το καλάθι σου</Text>
								<Text style={styles.basketTotal}>€{total}</Text>
							</Pressable>
						</Link>
					</SafeAreaView>
				</View>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	footer: {
		position: "absolute",
		backgroundColor: Colors.white,
		bottom: 0,
		left: 0,
		width: "100%",
		padding: 10,
		elevation: 10,
		shadowColor: Colors.black,
		shadowOffset: { width: 0, height: -10 },
		shadowOpacity: 0.1,
		shadowRadius: 10,
		paddingTop: 20,
	},
	fullButton: {
		backgroundColor: Colors.primary,
		paddingHorizontal: 16,
		borderRadius: 8,
		alignItems: "center",
		flexDirection: "row",
		flex: 1,
		justifyContent: "space-between",
		height: 50,
	},
	footerText: {
		color: Colors.white,
		fontSize: 16,
		fontWeight: "bold",
	},
	basket: {
		color: Colors.white,
		backgroundColor: Colors.mediumDark,
		padding: 8,
		borderRadius: 2,
		fontWeight: "bold",
	},
	basketTotal: {
		color: Colors.white,
		fontSize: 16,
		fontWeight: "bold",
	},
});
