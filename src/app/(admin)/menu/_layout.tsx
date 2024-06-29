import Colors from "@constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack, useSegments } from "expo-router";
import { Pressable, View } from "react-native";

/**
 * The `MenuStack` component within the `admin` folder is designed to manage the navigation and layout for the menu
 * management section of the administrative interface in a food ordering app. This component is a specialized stack
 * navigator that allows administrators to add, edit, and organize menu items, categories, and options.
 *
 * Key functionalities of the `admin` `MenuStack` include:
 * - A stack-based navigation system that provides a hierarchical structure for menu management tasks. This allows
 *   administrators to navigate through different screens related to menu items, such as adding a new item, editing
 *   an existing item, or organizing items into categories.
 * - Integration with the broader administrative layout, ensuring that the menu management functions are seamlessly
 *   incorporated into the admin's navigation flow.
 * - Custom screen options for enhancing the visual and interactive aspects of the navigation headers and buttons.
 *   This might include custom titles, header styles, and action buttons specific to menu management tasks.
 * - Utilization of dynamic routing and parameters to handle the editing and organization of specific menu items or
 *   categories, enabling a flexible and efficient management experience.
 *
 * This component is crucial for enabling administrators to effectively manage the app's menu, ensuring that the
 * food ordering service remains up-to-date and appealing to users.
 */
export default function MenuStack() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: "Menu",
					headerRight: () => (
						<View style={{ flexDirection: "row" }}>
							<Link href="/(admin)/menu/createCategory" asChild>
								<Pressable>
									{({ pressed }) => (
										<FontAwesome
											name="list"
											size={25}
											color={Colors.light.tint}
											style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
										/>
									)}
								</Pressable>
							</Link>
							<Link href={`menu/create`} asChild>
								<Pressable>
									{({ pressed }) => (
										<FontAwesome
											name="plus-square-o"
											size={25}
											color={Colors.light.tint}
											style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
										/>
									)}
								</Pressable>
							</Link>
						</View>
					),
				}}
			/>
			<Stack.Screen name="category/[category]" options={{ title: "" }} />
			<Stack.Screen name="(modal)/[product]" />
		</Stack>
	);
}
