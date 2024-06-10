import Colors from "@constants/Colors";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Link, Stack, useNavigation } from "expo-router";
import { Pressable } from "react-native";

export default function MenuStack() {
	const navigation = useNavigation();

	return (
		<Stack
			screenOptions={{
				headerRight: () => (
					<Link href="/cart" asChild>
						<Pressable>
							{({ pressed }) => (
								<FontAwesome
									name="shopping-cart"
									size={25}
									color={Colors.light.tint}
									style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
								/>
							)}
						</Pressable>
					</Link>
				),
			}}
		>
			<Stack.Screen name="index" options={{ title: "" }} />
			<Stack.Screen name="category/[category]" options={{ title: "" }} />
			<Stack.Screen
				name="(modal)/[product]"
				options={{
					presentation: "modal",
				}}
			/>
		</Stack>
	);
}
