import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { Order } from "../types";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { Link, useSegments } from "expo-router";
import { Tables } from "@/database.types";

dayjs.extend(relativeTime);

type OrderListItemProps = {
	order: Tables<"orders">;
};

/**
 * Renders a list item for an order, displaying its ID, creation time, and status.
 *
 * This component creates a pressable list item for an order. It displays the order's ID and status, as well as how long ago the order was created using `dayjs`. The entire list item is wrapped in a `Link` component, making it navigable to a detailed view of the order. The destination URL is dynamically constructed using the first segment from `useSegments` and the order's ID.
 *
 * @param {Object} props - Component props.
 * @param {OrderListItemProps} props.order - The order data to display, including its ID, creation time, and status.
 * @returns {React.ReactElement} A pressable, navigable list item displaying brief details of an order.
 */
const OrderListItem = ({ order }: OrderListItemProps) => {
	const segments = useSegments();

	return (
		<Link href={`/${segments[0]}/orders/${order.id}`} asChild>
			<Pressable style={styles.container}>
				<View>
					<Text style={styles.title}>Order #{order.id}</Text>
					<Text style={styles.time}>{dayjs(order.created_at).fromNow()}</Text>
				</View>

				<Text style={styles.status}>{order.status}</Text>
			</Pressable>
		</Link>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		padding: 10,
		borderRadius: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	title: {
		fontWeight: "bold",
		marginVertical: 5,
	},
	time: {
		color: "gray",
	},
	status: {
		fontWeight: "500",
	},
});

export default OrderListItem;
