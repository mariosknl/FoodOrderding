import { useBasketStore } from "@/store/basketStore";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import { Product } from "../types";
import { defaultPizzaImage } from "./ProductListItem";
import RemoteImage from "./RemoteImage";

type CartListItemProps = {
	cartItem: (Product & { quantity: number }) | null;
};

/**
 * Renders a single item in the shopping cart.
 *
 * This component displays the cart item's image, name, and price. It also includes a quantity selector
 * allowing the user to increase or decrease the quantity of the cart item. The component uses the `useBasketStore`
 * hook to access the `updateProduct` function, which is called when the quantity is changed.
 *
 * @param {Object} props - Component props.
 * @param {CartListItemProps} props.cartItem - The cart item to display. Contains information like the image path, name, price, and quantity.
 * @returns {React.ReactElement | null} The cart list item component or null if `cartItem` is not provided.
 */
const CartListItem = ({ cartItem }: CartListItemProps) => {
	const { updateProduct } = useBasketStore();

	if (!cartItem) return null;

	return (
		<View style={styles.container}>
			<RemoteImage
				path={cartItem?.img}
				fallback={defaultPizzaImage}
				style={styles.image}
				resizeMode="contain"
			/>
			<View style={{ flex: 1 }}>
				<Text style={styles.title}>{cartItem?.name}</Text>
				<View style={styles.subtitleContainer}>
					<Text style={styles.price}>${cartItem?.price?.toFixed(2)}</Text>
				</View>
			</View>
			<View style={styles.quantitySelector}>
				<FontAwesome
					onPress={() => updateProduct(cartItem, -1)}
					name="minus"
					color="gray"
					style={{ padding: 5 }}
				/>

				<Text style={styles.quantity}>{cartItem?.quantity}</Text>
				<FontAwesome
					onPress={() => updateProduct(cartItem, 1)}
					name="plus"
					color="gray"
					style={{ padding: 5 }}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		borderRadius: 10,
		padding: 5,
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
	},
	image: {
		width: 75,
		aspectRatio: 1,
		alignSelf: "center",
		marginRight: 10,
	},
	title: {
		fontWeight: "500",
		fontSize: 16,
		marginBottom: 5,
	},
	subtitleContainer: {
		flexDirection: "row",
		gap: 5,
	},
	quantitySelector: {
		flexDirection: "row",
		gap: 10,
		alignItems: "center",
		marginVertical: 10,
	},
	quantity: {
		fontWeight: "500",
		fontSize: 18,
	},
	price: {
		color: Colors.light.tint,
		fontWeight: "bold",
	},
});

export default CartListItem;
