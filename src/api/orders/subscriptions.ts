import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

/**
 * Provides React hooks for subscribing to insert and update events on the 'orders' table using Supabase Realtime.
 * These hooks utilize the @tanstack/react-query's useQueryClient for cache invalidation upon receiving the events.
 */

/**
 * useInsertOrderSubscription sets up a subscription to listen for insert events on the 'orders' table.
 * Upon detecting an insert event, it invalidates the React Query cache for 'orders' to ensure data freshness.
 *
 * @example
 * useInsertOrderSubscription();
 */
export const useInsertOrderSubscription = () => {
	const queryClient = useQueryClient();

	useEffect(() => {
		const orders = supabase
			.channel("custom-insert-channel")
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: "orders" },
				() => {
					queryClient.invalidateQueries({ queryKey: ["orders"] });
				}
			)
			.subscribe();
		return () => {
			orders.unsubscribe();
		};
	}, []);
};

/**
 * useUpdateOrderSubscription sets up a subscription to listen for update events on a specific order by its ID.
 * It invalidates the React Query cache for the specific order when an update event occurs, ensuring data freshness.
 *
 * @param {number} id - The ID of the order to subscribe to for update events.
 * @example
 * useUpdateOrderSubscription(1); // Subscribe to updates for order with ID 1
 */
export const useUpdateOrderSubscription = (id: number) => {
	const queryClient = useQueryClient();

	useEffect(() => {
		const orders = supabase
			.channel("custom-filter-channel")
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "orders",
					filter: `id=eq.${id}`,
				},
				(payload) => {
					queryClient.invalidateQueries({ queryKey: ["orders", id] });
				}
			)
			.subscribe();

		return () => {
			orders.unsubscribe();
		};
	}, []);
};
