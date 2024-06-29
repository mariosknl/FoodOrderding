import { supabase } from "@/lib/supabase";
import { InsertTables } from "@/types";
import { useMutation } from "@tanstack/react-query";

/**
 * Provides a mutation hook for inserting items into the 'order_items' table using Supabase.
 * This hook utilizes `@tanstack/react-query` for managing the mutation state, providing features
 * like loading status, error handling, and result caching.
 *
 * @returns A mutation object with methods to execute the mutation and track its state.
 *
 * @example
 * const { mutate, isLoading, error } = useInsertOrderItems();
 *
 * // To insert items
 * mutate([{ productId: 1, quantity: 2 }], {
 *   onSuccess: (newProduct) => {
 *     console.log('Order item inserted:', newProduct);
 *   },
 *   onError: (error) => {
 *     console.error('Insertion error:', error);
 *   },
 * });
 */
export const useInsertOrderItems = () => {
	return useMutation({
		async mutationFn(items: InsertTables<"order_items">[]) {
			const { error, data: newProduct } = await supabase
				.from("order_items")
				.insert(items)
				.select();

			if (error) {
				throw new Error(error.message);
			}
			return newProduct;
		},
	});
};
