import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InsertTables, UpdateTables } from "@/types";

/**
 * Fetches a list of items based on the given category ID.
 *
 * This hook uses the `useQuery` hook from React Query to asynchronously fetch items from the database.
 * It queries the "items" table in the database using Supabase, filtering by the given category ID.
 *
 * @param {number} categoryId - The ID of the category to filter items by.
 * @returns An object containing the following properties:
 * - `status`: The status of the query ('loading', 'error', 'success').
 * - `data`: The list of items fetched from the database, or `undefined` if the data is not yet available or an error occurred.
 * - `error`: The error object if an error occurred during the fetch operation.
 * - `isFetching`: A boolean indicating if the query is in the process of fetching data.
 * - `refetch`: A function that can be called to refetch the data.
 */
export const useItemsList = (categoryId: number) => {
	return useQuery({
		queryKey: ["items", categoryId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("items")
				.select(
					`
						id,
						name,
						price,
						img,
						info,
						type_id,
						types (
								id,
								name,
								category_id,
								categories (
										id,
										name,
										category_image
								)
						)
					`
				)
				.eq("types.category_id", categoryId);

			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

/**
 * Fetches a single item based on its ID.
 *
 * This hook uses the `useQuery` hook from React Query to asynchronously fetch a single item from the database.
 * It queries the "items" table in the database using Supabase, filtering by the given item ID.
 *
 * @param {number} id - The ID of the item to fetch.
 * @returns An object containing the following properties:
 * - `status`: The status of the query ('loading', 'error', 'success').
 * - `data`: The item fetched from the database, or `undefined` if the data is not yet available or an error occurred.
 * - `error`: The error object if an error occurred during the fetch operation.
 * - `isFetching`: A boolean indicating if the query is in the process of fetching data.
 * - `refetch`: A function that can be called to refetch the data.
 */
export const useItem = (id: number) => {
	return useQuery({
		queryKey: ["items", id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("items")
				.select(
					`
						id,
						name,
						price,
						img,
						info,
						type_id,
						types (
								id,
								name,
								category_id,
								categories (
										id,
										name,
										category_image
								)
						)
					`
				)
				.eq("id", id)
				.single();

			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
		refetchOnWindowFocus: true,
	});
};

/**
 * Fetches a list of all categories from the database.
 *
 * This hook uses the `useQuery` hook from React Query to asynchronously fetch categories from the database.
 * It queries the "categories" table in the database using Supabase.
 *
 * @returns An object containing the following properties:
 * - `status`: The status of the query ('loading', 'error', 'success').
 * - `data`: The list of categories fetched from the database, or `undefined` if the data is not yet available or an error occurred.
 * - `error`: The error object if an error occurred during the fetch operation.
 * - `isFetching`: A boolean indicating if the query is in the process of fetching data.
 * - `refetch`: A function that can be called to refetch the data.
 */
export const useCategoryList = () => {
	return useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const { data, error } = await supabase.from("categories").select("*");

			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
		refetchOnWindowFocus: true,
	});
};

/**
 * Fetches a single category based on its ID.
 *
 * This hook uses the `useQuery` hook from React Query to asynchronously fetch a single category from the database.
 * It queries the "categories" table in the database using Supabase, filtering by the given category ID.
 *
 * @param {number} categoryId - The ID of the category to fetch.
 * @returns An object containing the following properties:
 * - `status`: The status of the query ('loading', 'error', 'success').
 * - `data`: The category fetched from the database, or `undefined` if the data is not yet available or an error occurred.
 * - `error`: The error object if an error occurred during the fetch operation.
 * - `isFetching`: A boolean indicating if the query is in the process of fetching data.
 * - `refetch`: A function that can be called to refetch the data.
 */
export const useCategory = (categoryId: number) => {
	return useQuery({
		queryKey: ["categories", categoryId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("categories")
				.select(
					`
						id,
						name,
						category_image,
						types (
								id,
								name,
								category_id
						)
					`
				)
				.eq("id", categoryId);

			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
		refetchOnWindowFocus: true,
	});
};

/**
 * Performs an insert operation for a new category into the database.
 *
 * This hook uses the `useMutation` hook from React Query for the insert operation.
 * It inserts a new category into the "categories" table in the database using Supabase.
 *
 * @returns An object containing methods to execute the mutation and track its status.
 */
export const useInsertCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(data: InsertTables<"categories">) {
			const { error: categoryError, data: newCategory } = await supabase
				.from("categories")
				.insert(data)
				.select()
				.single();

			if (categoryError) {
				throw new Error(categoryError.message);
			}

			return newCategory;
		},
		async onSuccess(data, variables, context) {
			await queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
};

/**
 * Fetches a list of all types from the database.
 *
 * This hook uses the `useQuery` hook from React Query to asynchronously fetch the types from the database.
 * It queries the "types" table in the database using Supabase and returns the data.
 *
 * @returns An object containing the following properties:
 * - `status`: The status of the query ('loading', 'error', 'success').
 * - `data`: The list of types fetched from the database, or `undefined` if the data is not yet available or an error occurred.
 * - `error`: The error object if an error occurred during the fetch operation.
 * - `isFetching`: A boolean indicating if the query is in the process of fetching data.
 * - `refetch`: A function that can be called to refetch the data.
 */
export const useTypesList = () => {
	return useQuery({
		queryKey: ["types"],
		queryFn: async () => {
			const { data, error } = await supabase.from("types").select("*");

			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

/**
 * Fetches types based on a given category ID from the database.
 *
 * This hook uses the `useQuery` hook from React Query to asynchronously fetch types associated with a specific category ID from the database.
 * It queries the "types" table in the database using Supabase, filtering by the `category_id` field, and returns the data.
 *
 * @param {number} categoryId - The ID of the category to fetch types for.
 * @returns An object containing the following properties:
 * - `status`: The status of the query ('loading', 'error', 'success').
 * - `data`: The list of types fetched from the database, or `undefined` if the data is not yet available or an error occurred.
 * - `error`: The error object if an error occurred during the fetch operation.
 * - `isFetching`: A boolean indicating if the query is in the process of fetching data.
 * - `refetch`: A function that can be called to refetch the data.
 */
export const useTypes = (categoryId: number) => {
	return useQuery({
		queryKey: ["types"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("types")
				.select("*")
				.eq("category_id", categoryId);

			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

/**
 * Provides a mutation for inserting new types into the database.
 *
 * This hook uses the `useMutation` hook from React Query to asynchronously insert a new type into the "types" table in the database using Supabase.
 * After a successful insertion, it invalidates queries related to "types" to ensure data consistency across the application.
 *
 * @returns An object containing the mutation function and handlers for mutation's lifecycle events such as `onSuccess`.
 */
export const useInsertTypes = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(data: InsertTables<"types">) {
			console.log(data, "data from hook");
			const { error: typesError, data: newType } = await supabase
				.from("types")
				.insert(data)
				.select("*");

			if (typesError) {
				throw new Error(typesError.message);
			}
			return newType;
		},
		async onSuccess(data) {
			await queryClient.invalidateQueries({ queryKey: ["types"] });
		},
	});
};

/**
 * Provides a mutation for inserting new items into the database.
 *
 * This hook uses the `useMutation` hook from React Query to asynchronously insert a new item into the "items" table in the database using Supabase.
 * After a successful insertion, it invalidates queries related to "items" to ensure data consistency across the application.
 *
 * @returns An object containing the mutation function and handlers for mutation's lifecycle events such as `onSuccess`.
 */
export const useInsertItem = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(data: InsertTables<"items">) {
			const { error, data: newProduct } = await supabase
				.from("items")
				.insert(data)
				.select("*");

			if (error) {
				throw new Error(error.message);
			}
			return newProduct;
		},
		async onSuccess() {
			await queryClient.invalidateQueries({ queryKey: ["items"] });
		},
	});
};

/**
 * Provides a mutation for updating a category in the database.
 *
 * This hook uses the `useMutation` hook from React Query to asynchronously update a category in the "categories" table in the database using Supabase.
 * It allows updating fields such as `name` and `category_image`. After a successful update, it invalidates queries related to "categories" and "types" to ensure data consistency.
 *
 * @param {number} id - The ID of the category to update.
 * @returns An object containing the mutation function and handlers for mutation's lifecycle events such as `onSuccess`.
 */
export const useUpdateCategory = (id: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(data: UpdateTables<"categories">) {
			const { error, data: updatedCategory } = await supabase
				.from("categories")
				.update({
					name: data.name,
					category_image: data.category_image,
				})
				.eq("id", id)
				.select()
				.single();

			if (error) {
				throw new Error(error.message);
			}
			return updatedCategory;
		},
		async onSuccess(_, { id }) {
			await queryClient.invalidateQueries({ queryKey: ["categories"] });
			await queryClient.invalidateQueries({ queryKey: ["types"] });
			await queryClient.invalidateQueries({ queryKey: ["categories", id] });
		},
	});
};

/**
 * Provides a mutation for updating an item in the database.
 *
 * This hook uses the `useMutation` hook from React Query to asynchronously update an item in the "items" table in the database using Supabase.
 * It allows updating fields such as `name`, `image`, and `price`. After a successful update, it invalidates queries related to "items" to ensure data consistency.
 *
 * @returns An object containing the mutation function and handlers for mutation's lifecycle events such as `onSuccess`.
 */
export const useUpdateItem = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(data: UpdateTables<"items">) {
			const { error, data: updatedItem } = await supabase
				.from("items")
				.update({
					name: data.name,
					image: data.img,
					price: data.price,
				})
				.eq("id", data.id!)
				.select()
				.single();

			if (error) {
				throw new Error(error.message);
			}
			return updatedItem;
		},
		async onSuccess(_, { id }) {
			await queryClient.invalidateQueries({ queryKey: ["items"] });
			await queryClient.invalidateQueries({ queryKey: ["items", id] });
		},
	});
};

/**
 * Provides a mutation for deleting an item from the database.
 *
 * This hook uses the `useMutation` hook from React Query to asynchronously delete an item from the "items" table in the database using Supabase.
 * After a successful deletion, it invalidates queries related to "items" to ensure data consistency across the application.
 *
 * @returns An object containing the mutation function and handlers for mutation's lifecycle events such as `onSuccess`.
 */
export const useDeleteItem = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(id: number) {
			const { error } = await supabase.from("items").delete().eq("id", id);
			if (error) {
				throw new Error(error.message);
			}
		},
		async onSuccess() {
			await queryClient.invalidateQueries({ queryKey: ["items"] });
		},
	});
};

/**
 * Provides a mutation for deleting a category from the database.
 *
 * This hook uses the `useMutation` hook from React Query to asynchronously delete a category from the "categories" table in the database using Supabase.
 * After a successful deletion, it invalidates queries related to "categories" to ensure data consistency across the application.
 *
 * @returns An object containing the mutation function and handlers for mutation's lifecycle events such as `onSuccess`.
 */
export const useDeleteCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(id: number) {
			console.log("id", id);
			const { error } = await supabase.from("categories").delete().eq("id", id);
			if (error) {
				throw new Error(error.message);
			}
		},
		async onSuccess() {
			await queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
};
