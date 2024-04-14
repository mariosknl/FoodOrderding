import { useAdminOrdersList } from "@/api/orders";
import { ActivityIndicator, FlatList, Text } from "react-native";
import OrderListItem from "../../../../components/OrderListItem";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useInsertOrderSubscription } from "@/api/orders/subscriptions";

export default function OrdersScreen() {
	const {
		data: orders,
		isLoading,
		error,
	} = useAdminOrdersList({ archived: false });

	useInsertOrderSubscription();

	if (isLoading) {
		return <ActivityIndicator />;
	}

	if (error) {
		return <Text>Failed to fetch</Text>;
	}

	return (
		<FlatList
			data={orders}
			contentContainerStyle={{ gap: 10, padding: 10 }}
			renderItem={({ item }) => <OrderListItem order={item} />}
		/>
	);
}
