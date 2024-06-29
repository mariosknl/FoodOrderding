import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/store";
import { InsertTables, UpdateTables } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * This module provides custom hooks for managing orders in a React application using Supabase and React Query.
 * It includes hooks for fetching lists of orders, order details, inserting new orders, and updating existing orders.
 */

/**
 * useAdminOrdersList provides a query hook for fetching a list of orders based on their archival status.
 * It supports filtering orders as either archived or active based on their status.
 *
 * @param {Object} options - The options object.
 * @param {boolean} options.archived - Determines if archived orders should be fetched.
 * @returns A React Query useQuery instance containing the orders list and query status.
 */
export const useAdminOrdersList = ({ archived = false }) => {
	const statuses = archived ? ["Delivered"] : ["New", "Cooking", "Delivering"];

	return useQuery({
		queryKey: ["orders", { archived }],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("orders")
				.select("*")
				.in("status", statuses)
				.order("created_at", { ascending: false });
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

/**
 * useMyOrderList provides a query hook for fetching the current user's orders.
 * It automatically fetches orders based on the user's session ID.
 *
 * @returns A React Query useQuery instance containing the user's orders list and query status.
 */
export const useMyOrderList = () => {
	const { session } = useStore();
	const id = session?.user.id;

	return useQuery({
		queryKey: ["orders", { userId: id }],
		queryFn: async () => {
			if (!id) return null;
			const { data, error } = await supabase
				.from("orders")
				.select("*")
				.eq("user_id", id)
				.order("created_at", { ascending: false });
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

/**
 * useOrderDetails provides a query hook for fetching detailed information about a specific order,
 * including related order items and item details.
 *
 * @param {number} id - The ID of the order to fetch details for.
 * @returns A React Query useQuery instance containing the order details and query status.
 */
export const useOrderDetails = (id: number) => {
	return useQuery({
		queryKey: ["orders", id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("orders")
				.select("*, order_items(*, items(*))")
				.eq("id", id)
				.single();

			if (error) {
				throw new Error(error.message);
			}

			return data;
		},
	});
};

/**
 * useInsertOrder provides a mutation hook for inserting a new order into the database.
 * It automatically associates the new order with the current user's ID.
 *
 * @returns A React Query useMutation instance for inserting a new order.
 */
export const useInsertOrder = () => {
	const queryClient = useQueryClient();
	const { session } = useStore();
	const userId = session?.user.id;

	return useMutation({
		async mutationFn(data: InsertTables<"orders">) {
			const { error, data: newProduct } = await supabase
				.from("orders")
				.insert({ ...data, user_id: userId })
				.select()
				.single();

			if (error) {
				throw new Error(error.message);
			}
			return newProduct;
		},
		async onSuccess() {
			await queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
	});
};

/**
 * useUpdateOrder provides a mutation hook for updating an existing order's details in the database.
 * It supports updating any field of an order specified by its ID.
 *
 * @returns A React Query useMutation instance for updating an order.
 */
export const useUpdateOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn({
			id,
			updatedFields,
		}: {
			id: number;
			updatedFields: UpdateTables<"orders">;
		}) {
			const { error, data: updatedOrder } = await supabase
				.from("orders")
				.update(updatedFields)
				.eq("id", id)
				.select()
				.single();

			if (error) {
				throw new Error(error.message);
			}
			return updatedOrder;
		},
		async onSuccess(_, { id }) {
			await queryClient.invalidateQueries({ queryKey: ["orders"] });
			await queryClient.invalidateQueries({ queryKey: ["orders", id] });
		},
	});
};
