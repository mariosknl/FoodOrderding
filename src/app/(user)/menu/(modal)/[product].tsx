import { useItem } from "@/api/products";
import Button from "@/components/Button";
import RemoteImage from "@/components/RemoteImage";
import Colors from "@/constants/Colors";
import { useBasketStore } from "@/store/basketStore";
import { Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

/**
 * The `ProductDetailsScreen` component is responsible for displaying the detailed information of a specific product
 * in a food ordering app. It is designed to fetch and present detailed data such as the product's name, description,
 * price, and images. This component is typically accessed by selecting a product from a list, such as on the `MenuScreen`
 * or `CategoryPage`.
 *
 * Key features of the `ProductDetailsScreen` include:
 * - Fetching product details using a product ID, which is typically passed via navigation parameters.
 * - Displaying the product's images, name, description, and price in a user-friendly layout.
 * - Providing an option for the user to add the product to their cart, including selecting quantities if applicable.
 * - Handling loading states and potential errors during the fetch operation, ensuring a smooth user experience.
 *
 * This component is crucial for allowing users to explore products in depth before making a purchase decision,
 * contributing significantly to the overall functionality and user experience of the food ordering app.
 */
const ProductDetailsScreen = () => {
	const { id, category } = useLocalSearchParams();
	const navigation = useNavigation();
	const { addProduct } = useBasketStore();

	if (!id || Array.isArray(id)) return;

	const { data: product } = useItem(parseFloat(id));

	if (!product) return;

	const addToCart = () => {
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		navigation.goBack();
		addProduct(product as Product);
	};

	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					headerTitle: category as string,
					headerLeft: () => (
						<Pressable onPress={() => navigation.goBack()}>
							<Ionicons name="arrow-back" size={20} />
						</Pressable>
					),
				}}
			/>
			<RemoteImage
				path={product.img}
				style={styles.image}
				fallback="@assets/images/defaultΙmage.png"
			/>

			<View style={styles.innerContainer}>
				<Text style={styles.title}>{product.name}</Text>
				<Text style={styles.price}>€{product.price}</Text>
				<Text style={styles.info}>{product.info}</Text>

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
		aspectRatio: 1,
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
	info: {
		color: Colors.black,
		fontSize: 16,
	},
});
