import { useOrderDetails } from "@/api/orders";
import { useUpdateOrderSubscription } from "@/api/orders/subscriptions";
import OrderItemListItem from "@/components/OrderItemListItem";
import OrderListItem from "@/components/OrderListItem";
import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

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
