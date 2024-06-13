import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InsertTables, UpdateTables } from "@/types";

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
