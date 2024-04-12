import Button from "@/components/Button";
import CartListItem from "@/components/CartListItem";
import { useCart } from "@providers/CartProvider";
import { StatusBar } from "expo-status-bar";
import { FlatList, Platform, Text, View } from "react-native";
const CartScreen = () => {
	const { items, total } = useCart();

	return (
		<View style={{ padding: 10 }}>
			<FlatList
				data={items}
				renderItem={({ item }) => <CartListItem cartItem={item} />}
				contentContainerStyle={{ gap: 10 }}
			/>

			<Text style={{ marginTop: 10, fontSize: 20, fontWeight: "500" }}>
				Total: € {total}
			</Text>
			<Button text="Checkout" />

			{/* Use a light status bar on iOS to account for the black space above the modal */}
			<StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
		</View>
	);
};
export default CartScreen;
