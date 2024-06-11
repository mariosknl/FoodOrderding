import Button from "@/components/Button";
import { defaultPizzaImage } from "@/components/ProductListItem";
import Colors from "@/constants/Colors";
import { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Image,
	Alert,
	ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import {
	useCategoryList,
	useDeleteProduct,
	useInsertItem,
	useInsertProduct,
	useItem,
	useTypesList,
	useUpdateProduct,
} from "@/api/products";
import { randomUUID } from "expo-crypto";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
const CreateProductScreen = () => {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [info, setInfo] = useState("");
	const [errors, setErrors] = useState("");
	const [image, setImage] = useState<string | null>(null);
	const [categoryValue, setCategoryValue] = useState<number | null>(null);
	const [typeValue, setTypeValue] = useState<number | null>(null);
	const [isFocus, setIsFocus] = useState(false);

	const { id: idString } = useLocalSearchParams();

	const id = parseFloat(
		typeof idString === "string" ? idString : idString?.[0] ?? ""
	);

	let imageSource = image
		? { uri: image }
		: require("@assets/images/defaultΙmage.png");

	const isUpdating = !!idString;

	const { mutate: insertItem } = useInsertItem();
	const { mutate: updateProduct } = useUpdateProduct();
	const { data: updatingProduct } = useItem(id);
	const { mutate: deleteProduct } = useDeleteProduct();
	const { data: categories } = useCategoryList();
	const { data: types } = useTypesList();

	const filteredTypes = types?.filter(
		(type) => type.category_id === categoryValue
	);

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

		try {
			const imagePath = await uploadImage();

			// save in the db
			insertItem(
				{
					price: parseFloat(price),
					name,
					img: imagePath,
					type_id: typeValue,
					info,
				},
				{
					onSuccess: () => {
						resetFields();
						router.back();
					},
					onError: (error) => {
						console.log("error", error);
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

	const renderLabel = (type: "category" | "type") => {
		if (categoryValue || isFocus) {
			return (
				<Text style={[styles.label, isFocus && { color: Colors.primary }]}>
					{type === "category" ? "Κατηγορία" : "Τύπος"}
				</Text>
			);
		}
		return null;
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Stack.Screen
				options={{
					title: isUpdating ? "Ανανέωση Προϊόντος" : "Δημιουργία Προϊόντος",
				}}
			/>
			<Image source={imageSource} style={styles.image} />
			<Text onPress={pickImage} style={styles.textButton}>
				Επιλογή Εικόνας
			</Text>

			<View>
				<Dropdown
					style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
					placeholderStyle={styles.placeholderStyle}
					selectedTextStyle={styles.selectedTextStyle}
					inputSearchStyle={styles.inputSearchStyle}
					iconStyle={styles.iconStyle}
					data={categories!}
					search
					maxHeight={300}
					labelField="name"
					valueField="id"
					placeholder={!isFocus ? "Διάλεξε κατηγορία" : "..."}
					searchPlaceholder="Search..."
					value={categoryValue?.toString()}
					onFocus={() => setIsFocus(true)}
					onBlur={() => setIsFocus(false)}
					onChange={(item) => {
						setCategoryValue(item.id);
						setIsFocus(false);
					}}
					renderLeftIcon={() => (
						<FontAwesome
							style={styles.icon}
							color={isFocus ? "blue" : "black"}
							name="list"
							size={20}
						/>
					)}
				/>
			</View>

			<View>
				{categoryValue ? (
					<Dropdown
						style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
						placeholderStyle={styles.placeholderStyle}
						selectedTextStyle={styles.selectedTextStyle}
						inputSearchStyle={styles.inputSearchStyle}
						iconStyle={styles.iconStyle}
						data={filteredTypes!}
						search
						maxHeight={300}
						labelField="name"
						valueField="id"
						placeholder={!isFocus ? "Διάλεξε Τύπο" : "..."}
						searchPlaceholder="Search..."
						value={typeValue?.toString()}
						onFocus={() => setIsFocus(true)}
						onBlur={() => setIsFocus(false)}
						onChange={(item) => {
							setTypeValue(item.id);
							setIsFocus(false);
						}}
						renderLeftIcon={() => (
							<AntDesign
								style={styles.icon}
								color={isFocus ? "blue" : "black"}
								name="Safety"
								size={20}
							/>
						)}
					/>
				) : null}
			</View>

			<TextInput
				value={name}
				onChangeText={setName}
				placeholder="Όνομα"
				style={styles.input}
			/>
			<TextInput
				value={price}
				onChangeText={setPrice}
				placeholder="Τιμή"
				style={styles.input}
			/>

			<View>
				<Text style={styles.title}>Πληροφορίες προϊόντος</Text>
				<TextInput
					multiline={true}
					numberOfLines={2}
					onChangeText={setInfo}
					value={info}
					style={styles.textarea}
				/>
			</View>

			<Text style={{ color: "red" }}>{errors}</Text>
			<Button onPress={onSubmit} text={isUpdating ? "Update" : "Create"} />
			{isUpdating && (
				<Text onPress={confirmDelete} style={styles.textButton}>
					Delete
				</Text>
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-start",
		padding: 10,
		gap: 8,
	},
	input: {
		backgroundColor: "white",
		padding: 10,
		borderRadius: 5,
	},
	title: {
		fontSize: 16,
	},
	textarea: {
		backgroundColor: "white",
		marginTop: 5,
		borderRadius: 5,
		height: 80,
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
	label: {
		position: "absolute",
		backgroundColor: "white",
		left: 22,
		top: 8,
		zIndex: 999,
		paddingHorizontal: 8,
		fontSize: 14,
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

export default CreateProductScreen;
