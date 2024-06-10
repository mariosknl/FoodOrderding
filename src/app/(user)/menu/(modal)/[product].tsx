import { shopInfo } from "@assets/data/restaurant";
import Button from "@/components/Button";
import Colors from "@/constants/Colors";
import { useBasketStore } from "@/store/basketStore";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

const ProductDetailsScreen = () => {
	const { id, category } = useLocalSearchParams();
	const navigation = useNavigation();
	const { addProduct } = useBasketStore();

	// check if category is not a string
	if (typeof category !== "string") return;

	if (!id || Array.isArray(id)) return;

	const getProductById = (productId: string) => {
		const allItems = shopInfo.products.flatMap((category) =>
			category.types.flatMap((type) => type.items)
		);
		return allItems.find((item) => item.id === productId) || null;
	};

	const product = getProductById(id);

	if (!product) return;

	const addToCart = () => {
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		navigation.goBack();
		addProduct(product);
	};

	return (
		<View style={styles.container}>
			<Stack.Screen options={{ headerTitle: category }} />
			<Image source={product.img} style={styles.image} />

			<View style={styles.innerContainer}>
				<Text style={styles.title}>{product.name}</Text>
				<Text style={styles.price}>€{product.price}</Text>

				<Button text="Add to Cart" onPress={addToCart} />
			</View>
		</View>
	);
};
export default ProductDetailsScreen;
const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.white,
		flex: 1,
	},
	innerContainer: {
		padding: 10,
	},
	image: {
		width,
	},
	title: {
		fontSize: 18,
		fontWeight: "600",
		marginVertical: 10,
	},
	price: {
		color: Colors.primary,
		fontWeight: "bold",
		marginTop: "auto",
	},
});
