import Colors from "@constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { Pressable, View } from "react-native";

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
							<Link href="/(admin)/menu/create" asChild>
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
