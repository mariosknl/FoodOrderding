import Button from "@/components/Button";
import { defaultPizzaImage } from "@/components/ProductListItem";
import Colors from "@/constants/Colors";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import {
	useDeleteProduct,
	useInsertProduct,
	useItem,
	useUpdateProduct,
} from "@/api/products";
import { randomUUID } from "expo-crypto";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
const CreateProductScreen = () => {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [errors, setErrors] = useState("");
	const [image, setImage] = useState<string | null>(null);

	const { id: idString } = useLocalSearchParams();

	const id = parseFloat(
		typeof idString === "string" ? idString : idString?.[0] ?? ""
	);

	const isUpdating = !!idString;

	const { mutate: insertProduct } = useInsertProduct();
	const { mutate: updateProduct } = useUpdateProduct();
	const { data: updatingProduct } = useItem(id);
	const { mutate: deleteProduct } = useDeleteProduct();

	const router = useRouter();

	useEffect(() => {
		if (updatingProduct) {
			setName(updatingProduct.name);
			setPrice(updatingProduct.price.toString());
			setImage(updatingProduct.img);
		}
	}, [updatingProduct]);

	const resetFields = () => {
		setName("");
		setPrice("");
	};

	const validateInput = () => {
		if (!name) {
			setErrors("Name is required");
			return false;
		}
		if (!price) {
			setErrors("Price is required");
			return false;
		}
		if (isNaN(parseFloat(price))) {
			setErrors("Price is not a number");
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

		const imagePath = await uploadImage();

		// save in the db
		insertProduct(
			{ name, price: parseFloat(price), image: imagePath },
			{
				onSuccess: () => {
					resetFields();
					router.back();
				},
			}
		);
	};

	const onUpdate = async () => {
		setErrors("");
		if (!validateInput()) {
			return;
		}

		const imagePath = await uploadImage();

		// update in the db
		updateProduct(
			{ id, name, price: parseFloat(price), image: imagePath },
			{
				onSuccess: () => {
					resetFields();
					router.back();
				},
			}
		);
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
		deleteProduct(id, {
			onSuccess: () => {
				resetFields();
				router.replace("/(admin)");
			},
		});
	};

	const confirmDelete = () => {
		Alert.alert("Confirm", "Are you sure you want to delete this product?", [
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
				options={{ title: isUpdating ? "Update Product" : "Create Product" }}
			/>
			<Image
				source={{ uri: image ?? defaultPizzaImage }}
				style={styles.image}
			/>
			<Text onPress={pickImage} style={styles.textButton}>
				Select Image
			</Text>

			<Text style={styles.label}>Name</Text>
			<TextInput
				value={name}
				onChangeText={setName}
				placeholder="Name"
				style={styles.input}
			/>

			<Text style={styles.label}>Price (€)</Text>
			<TextInput
				value={price}
				onChangeText={setPrice}
				placeholder="9.99"
				style={styles.input}
				keyboardType="numeric"
			/>

			<Text style={{ color: "red" }}>{errors}</Text>
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
		aspectRatio: 1,
		alignSelf: "center",
	},
	textButton: {
		alignSelf: "center",
		fontWeight: "bold",
		color: Colors.light.tint,
		marginVertical: 10,
	},
});

export default CreateProductScreen;
