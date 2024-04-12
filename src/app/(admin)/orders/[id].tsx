import OrderItemListItem from "@/components/OrderItemListItem";
import OrderListItem from "@/components/OrderListItem";
import Colors from "@/constants/Colors";
import { OrderStatusList } from "@/types";
import orders from "@assets/data/orders";
import { Stack, useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

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
				ListFooterComponent={() => (
					<>
						<Text style={{ fontWeight: "bold" }}>Status</Text>
						<View style={{ flexDirection: "row", gap: 5 }}>
							{OrderStatusList.map((status) => (
								<Pressable
									key={status}
									onPress={() => console.warn("Update status")}
									style={{
										borderColor: Colors.light.tint,
										borderWidth: 1,
										padding: 10,
										borderRadius: 5,
										marginVertical: 10,
										backgroundColor:
											order.status === status
												? Colors.light.tint
												: "transparent",
									}}
								>
									<Text
										style={{
											color:
												order.status === status ? "white" : Colors.light.tint,
										}}
									>
										{status}
									</Text>
								</Pressable>
							))}
						</View>
					</>
				)}
			/>
		</View>
	);
}
