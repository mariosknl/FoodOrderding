import OrderItemListItem from "@/components/OrderItemListItem";
import OrderListItem from "@/components/OrderListItem";
import orders from "@assets/data/orders";
import { Stack, useLocalSearchParams } from "expo-router";
import { FlatList, Text, View } from "react-native";

export default function OrderDetailsScreen() {
	const { id } = useLocalSearchParams();

	const order = orders.find((order) => order.id.toString() === id);

	if (!order) {
		return (
			<View>
				<Text>Order not found</Text>
			</View>
		);
	}

	return (
		<View style={{ padding: 10, gap: 20 }}>
			<Stack.Screen options={{ title: `Order Details #${id}` }} />

			<OrderListItem order={order} />

			<FlatList
				data={order.order_items}
				renderItem={({ item }) => <OrderItemListItem item={item} />}
				contentContainerStyle={{ gap: 10 }}
				// ListHeaderComponent={() => <OrderListItem order={order} />}
			/>
		</View>
	);
}
