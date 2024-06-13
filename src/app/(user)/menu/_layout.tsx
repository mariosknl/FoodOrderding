import { useBasketStore } from "@/store/basketStore";
import Colors from "@constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack, useSegments } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function MenuStack() {
	const { items } = useBasketStore();

	return (
		<Stack
			screenOptions={{
				headerRight: () => (
					<Link href="/cart" asChild>
						<Pressable>
							{({ pressed }) => (
								<View>
									<FontAwesome
										name="shopping-cart"
										size={25}
										color={Colors.light.tint}
										style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
									/>
									{items > 0 ? (
										<View style={styles.cartCountContainer}>
											<Text style={styles.cartCountText}>{items}</Text>
										</View>
									) : null}
								</View>
							)}
						</Pressable>
					</Link>
				),
			}}
		>
			{/* <Stack.Screen name="index" options={{ title: "" }} /> */}
			<Stack.Screen name={`category/[category]`} options={{ title: "" }} />
			<Stack.Screen name={`(modal)/[product]`} />
		</Stack>
	);
}

const styles = StyleSheet.create({
	cartCountContainer: {
		position: "absolute",
		height: 17,
		width: 17,
		borderRadius: 10,
		backgroundColor: Colors.primary,
		right: 10,
		bottom: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	cartCountText: {
		color: "white",
		fontWeight: "bold",
	},
});
