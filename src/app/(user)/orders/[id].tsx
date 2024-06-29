import { useOrderDetails } from "@/api/orders";
import { useUpdateOrderSubscription } from "@/api/orders/subscriptions";
import OrderItemListItem from "@/components/OrderItemListItem";
import OrderListItem from "@/components/OrderListItem";
import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

/**
 * The `OrderDetailsScreen` component is designed to display the detailed information of a specific order
 * within a food ordering app. This screen is accessible typically after a user has placed an order and wants
 * to view its details, such as the items ordered, total cost, order status, and delivery details.
 *
 * Key functionalities of the `OrderDetailsScreen` include:
 * - Fetching and displaying detailed information about an order based on the order ID. The order ID is usually
 *   obtained from the navigation parameters or the app's state.
 * - Presenting a comprehensive view of the order, including itemized details, quantities, prices, and the total amount.
 * - Showing the current status of the order (e.g., pending, in preparation, on the way, delivered) to keep the user
 *   informed about the progress of their order.
 * - Providing options for user actions such as reordering, contacting support, or tracking the delivery, depending on
 *   the app's features and the order's status.
 *
 * This component plays a crucial role in enhancing the post-order user experience by keeping users informed about
 * their order's status and offering them relevant actions to manage their order post-purchase.
 */
export default function OrderDetailsScreen() {
	const { id: idString } = useLocalSearchParams();
	const id = parseFloat(
		typeof idString === "string" ? idString : idString ? idString[0] : "0"
	);

	const { data: order, error, isLoading } = useOrderDetails(id);
	useUpdateOrderSubscription(id);

	if (!order) {
		return (
			<View>
				<Text>Order not found</Text>
			</View>
		);
	}

	if (isLoading) {
		return <ActivityIndicator />;
	}

	if (error) {
		return <Text>Failed to fetch</Text>;
	}

	return (
		<View style={{ padding: 10, gap: 20 }}>
			<Stack.Screen options={{ title: `Order Details #${id}` }} />

			<OrderListItem order={order} />

			<FlatList
				data={order.order_items}
				renderItem={({ item }) => item && <OrderItemListItem item={item} />}
				contentContainerStyle={{ gap: 10 }}
			/>
		</View>
	);
}
