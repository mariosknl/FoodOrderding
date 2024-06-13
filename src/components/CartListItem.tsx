import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import { CartItem, Product } from "../types";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useCart } from "@providers/CartProvider";
import { defaultPizzaImage } from "./ProductListItem";
import RemoteImage from "./RemoteImage";
import { Tables } from "@/database.types";

type CartListItemProps = {
	cartItem: (Product & { quantity: number }) | null;
};

const CartListItem = ({ cartItem }: CartListItemProps) => {
	const { updateQuantity } = useCart();

	if (!cartItem) return null;

	console.log("cartItem", cartItem);

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
					onPress={() => updateQuantity(cartItem.id.toString(), -1)}
					name="minus"
					color="gray"
					style={{ padding: 5 }}
				/>

				<Text style={styles.quantity}>{cartItem?.quantity}</Text>
				<FontAwesome
					onPress={() => updateQuantity(cartItem?.id.toString(), 1)}
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
