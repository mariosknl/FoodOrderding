import { Tables } from "@/database.types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import { defaultPizzaImage } from "./ProductListItem";
import RemoteImage from "./RemoteImage";

type OrderItemListItemProps = {
	item: { items: Tables<"items"> | null } & Tables<"order_items">;
};

const OrderItemListItem = ({ item }: OrderItemListItemProps) => {
	return (
		<View style={styles.container}>
			<RemoteImage
				path={item?.items?.img}
				fallback={defaultPizzaImage}
				style={styles.image}
				resizeMode="contain"
			/>
			<View style={{ flex: 1 }}>
				<Text style={styles.title}>{item.items?.name}</Text>
				<View style={styles.subtitleContainer}>
					<Text style={styles.price}>€{item.items?.price}</Text>
				</View>
			</View>
			<View style={styles.quantitySelector}>
				<Text style={styles.quantity}>{item?.quantity}</Text>
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

export default OrderItemListItem;
