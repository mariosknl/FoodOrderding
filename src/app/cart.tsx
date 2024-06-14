import Button from "@/components/Button";
import CartListItem from "@/components/CartListItem";
import { useBasketStore } from "@/store/basketStore";
import { useStore } from "@/store/store";
import { useCart } from "@providers/CartProvider";
import { useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Alert, FlatList, Platform, Text, View } from "react-native";
const CartScreen = () => {
	const { items, total } = useBasketStore();
	const { products, checkout } = useBasketStore();
	const { profile } = useStore();
	const router = useRouter();
	const navigation = useNavigation();

	const handleCheckout = async () => {
		if (profile?.address === "" || profile?.phone === "") {
			Alert.alert(
				"Incomplete Profile",
				"Please complete your profile",
				[
					{
						text: "OK",
						onPress: () => router.push("/profile"),
					},
				],
				{ cancelable: false }
			);
		} else {
			const orderCode = await checkout();
			navigation.navigate("checkoutScreen", { orderCode });
		}
	};

	return (
		<View style={{ padding: 10 }}>
			<FlatList
				data={products}
				renderItem={({ item }) => <CartListItem cartItem={item} />}
				contentContainerStyle={{ gap: 10 }}
			/>

			<Text style={{ marginTop: 10, fontSize: 20, fontWeight: "500" }}>
				Total: € {total}
			</Text>
			<Button text="Checkout" onPress={handleCheckout} />

			{/* Use a light status bar on iOS to account for the black space above the modal */}
			<StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
		</View>
	);
};
export default CartScreen;
