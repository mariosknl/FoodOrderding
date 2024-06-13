import {
	useCategory,
	useCategoryList,
	useDeleteCategory,
	useDeleteItem,
	useInsertCategory,
	useUpdateCategory,
	useUpdateItem,
} from "@/api/products";
import Button from "@/components/Button";
import RemoteImage from "@/components/RemoteImage";
import Colors from "@/constants/Colors";
import { Tables } from "@/database.types";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { decode } from "base64-arraybuffer";
import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	Alert,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";

const CreateCategoryScreen = () => {
	const [name, setName] = useState("");
	const [types, setTypes] = useState([{ name: "" }]);
	const [errors, setErrors] = useState("");
	const [image, setImage] = useState<string | null>(null);
	const queryClient = useQueryClient();

	const { categoryId: idString } = useLocalSearchParams();

	const id = parseFloat(
		typeof idString === "string" ? idString : idString?.[0] ?? ""
	);

	let imageSource = image
		? { uri: image }
		: require("@assets/images/defaultΙmage.png");

	const handleAddType = () => {
		setTypes([...types, { name: "" }]);
	};

	const handleTypeChange = (text: string, index: number) => {
		const newTypes = [...types];
		newTypes[index].name = text;
		setTypes(newTypes);
	};

	const isUpdating = !!idString;

	const { mutate: insertCategory } = useInsertCategory();
	const { mutate: updateCategory } = useUpdateCategory(id);
	const { data: updatingCategory } = useCategory(id);
	const { mutate: deleteCategory } = useDeleteCategory();

	const router = useRouter();
	console.log("updatingCategory", updatingCategory);

	useEffect(() => {
		if (updatingCategory && isUpdating) {
			setName(updatingCategory[0]?.name);
			setImage(updatingCategory[0]?.category_image);
			setTypes(updatingCategory[0]?.types);
		}
	}, [updatingCategory]);

	const resetFields = () => {
		setName("");
		setTypes([{ name: "" }]);
		setImage(null);
	};

	const validateInput = () => {
		if (!name) {
			setErrors("Name is required");
			return false;
		}
		return true;
	};

	const onSubmit = () => {
		if (isUpdating) {
			// update in the db
			onUpdate();
		} else {
			// create in the db
			onCreate();
		}
	};

	const onCreate = async () => {
		setErrors("");
		if (!validateInput()) {
			return;
		}

		try {
			const imagePath = await uploadImage();

			// save in the db
			insertCategory(
				{ name, category_image: imagePath },
				{
					onSuccess: async (newCategory) => {
						let newType;
						try {
							const typeInserts = types.map((type) => ({
								category_id: newCategory.id,
								name: type.name,
							}));

							const { data: newTypeData, error: typesError } = await supabase
								.from("types")
								.insert(typeInserts)
								.select("*");

							if (typesError) {
								throw new Error(typesError.message);
							}

							newType = newTypeData;
						} catch (error) {
							console.log("error on insertType", error);
						} finally {
							resetFields();
							Alert.alert("Success", "Category and types created successfully");
							router.back();
						}
						return newType;
					},
					onError: (error: any) => {
						if (error) {
							console.log("Error onCreate:", error);
						} else {
							console.log("Error onCreate: error object is null");
						}
					},
				}
			);
		} catch (error: any) {
			Alert.alert("Error", error.message);
		}
	};

	const onUpdate = async () => {
		setErrors("");
		if (!validateInput()) {
			return;
		}

		try {
			const imagePath = await uploadImage();

			// update in the db
			updateCategory(
				{ name, category_image: imagePath },
				{
					onSuccess: async (_, { id }) => {
						try {
							await Promise.all(
								types.map(async (type: any) => {
									const { data, error } = await supabase
										.from("types")
										.update({ name: type.name })
										.eq("id", type.id)
										.select("*");

									if (error) {
										throw error;
									}

									return data;
								})
							);
							await Promise.all([
								queryClient.invalidateQueries({
									queryKey: ["categories", id],
								}),
								queryClient.invalidateQueries({ queryKey: ["types"] }),
								queryClient.invalidateQueries({ queryKey: ["types", id] }),
							]);
							Alert.alert("Success", "Category and types created successfully");
							resetFields();
							router.back();
						} catch (error) {
							console.log("error on updatingType", error);
						}
					},
				}
			);
		} catch (error: any) {
			Alert.alert("Error", error.message);
		}
	};

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	const uploadImage = async () => {
		if (!image?.startsWith("file://")) {
			return;
		}

		const base64 = await FileSystem.readAsStringAsync(image, {
			encoding: "base64",
		});
		const filePath = `${randomUUID()}.png`;
		const contentType = "image/png, image/jpeg, image/jpg";

		const { data, error } = await supabase.storage
			.from("product-images")
			.upload(filePath, decode(base64), { contentType });

		console.log(error);

		if (data) {
			return data.path;
		}
	};

	const onDelete = () => {
		deleteCategory(id, {
			onSuccess: () => {
				resetFields();
				router.replace("(admin)/menu");
			},
		});
	};

	const confirmDelete = () => {
		Alert.alert("Confirm", "Are you sure you want to delete this category?", [
			{
				text: "Cancel",
			},
			{
				text: "Delete",
				style: "destructive",
				onPress: onDelete,
			},
		]);
	};

	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					title: isUpdating ? "Ανανέωση Κατηγορίας" : "Δημιουργία Κατηγορίας",
				}}
			/>
			{!isUpdating ? (
				<Image source={imageSource} style={styles.image} />
			) : (
				<RemoteImage
					path={image}
					style={styles.image}
					fallback="@assets/images/defaultΙmage.png"
				/>
			)}
			<Text onPress={pickImage} style={styles.textButton}>
				Επιλογή Εικόνας
			</Text>

			<Text style={styles.label}>Name</Text>
			<TextInput
				value={name}
				onChangeText={setName}
				placeholder="Name"
				style={styles.input}
			/>

			<ScrollView>
				<Text style={styles.label}>Types:</Text>
				{types?.map((type, index) => (
					<TextInput
						key={index}
						value={type?.name}
						onChangeText={(text) => handleTypeChange(text, index)}
						style={styles.input}
						keyboardType="numeric"
					/>
				))}
			</ScrollView>

			<Text style={{ color: "red" }}>{errors}</Text>
			<Button onPress={handleAddType} text="Add Type" />
			<Button onPress={onSubmit} text={isUpdating ? "Update" : "Create"} />
			{isUpdating && (
				<Text onPress={confirmDelete} style={styles.textButton}>
					Delete
				</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 10,
	},
	label: {
		color: "gray",
		fontSize: 16,
	},
	input: {
		backgroundColor: "white",
		padding: 10,
		borderRadius: 5,
		marginTop: 5,
		marginBottom: 20,
	},
	image: {
		width: "50%",
		height: undefined,
		aspectRatio: 1,
		alignSelf: "center",
	},
	textButton: {
		alignSelf: "center",
		fontWeight: "bold",
		color: Colors.light.tint,
		marginVertical: 10,
	},
	dropdown: {
		height: 50,
		borderColor: "gray",
		borderWidth: 0.5,
		borderRadius: 8,
		paddingHorizontal: 8,
	},
	icon: {
		marginRight: 5,
	},
	placeholderStyle: {
		fontSize: 16,
	},
	selectedTextStyle: {
		fontSize: 16,
	},
	iconStyle: {
		width: 20,
		height: 20,
	},
	inputSearchStyle: {
		height: 40,
		fontSize: 16,
	},
});

export default CreateCategoryScreen;
