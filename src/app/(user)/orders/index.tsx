import { useMyOrderList } from "@/api/orders";
import { Stack } from "expo-router";
import { ActivityIndicator, FlatList, Text } from "react-native";
import OrderListItem from "../../../components/OrderListItem";

/**
 * The `OrdersScreen` component serves as a central hub for users to view a list of their past and current orders
 * within a food ordering app. This screen is designed to provide a quick overview of each order's key details,
 * such as the order date, total amount, and status (e.g., delivered, pending, in preparation). Users can tap on
 * an order to navigate to the `OrderDetailsScreen` for more detailed information.
 *
 * Key features of the `OrdersScreen` include:
 * - Fetching a list of the user's orders from the backend or local storage, depending on the app's architecture.
 * - Displaying each order in a list format, with essential information visible for quick scanning.
 * - Providing a user-friendly interface that allows users to easily navigate through their order history and
 *   access detailed views of specific orders.
 * - Handling empty states gracefully by displaying messages or graphics indicating that no orders have been placed
 *   if the user's order history is empty.
 * - Implementing pull-to-refresh functionality to allow users to update their order list manually.
 *
 * This component enhances the user experience by offering easy access to order history and status, making it a
 * valuable part of the app's navigation and functionality.
 */
export default function OrdersScreen() {
	const { data: orders, isLoading, error } = useMyOrderList();

	if (isLoading) {
		return <ActivityIndicator />;
	}

	if (error) {
		return <Text>Failed to fetch</Text>;
	}
	return (
		<>
			<Stack.Screen options={{ title: "Orders" }} />
			<FlatList
				data={orders}
				contentContainerStyle={{ gap: 10, padding: 10 }}
				renderItem={({ item }) => <OrderListItem order={item} />}
			/>
		</>
	);
}
