import { useItem } from "@/api/products";
import Button from "@/components/Button";
import { defaultPizzaImage } from "@/components/ProductListItem";
import RemoteImage from "@/components/RemoteImage";
import Colors from "@/constants/Colors";
import { useBasketStore } from "@/store/basketStore";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

/**
 * `ProductDetailsScreen` is a React component that displays detailed information about a specific product.
 * It fetches product details based on the `id` provided in the URL path parameters.
 * This screen includes information such as the product name, description, price, and images.
 * Users can also add the product to their cart from this screen.
 *
 * The component makes use of the `useProductDetails` hook to fetch the product's details
 * and handles loading and error states accordingly.
 *
 * @returns A React component that renders the detailed view of a product, including
 * name, description, price, and images, with an option to add the product to the cart.
 */
const ProductDetailsScreen = () => {
	const { id: idString } = useLocalSearchParams();
	const router = useRouter();
	const { addProduct } = useBasketStore();

	if (!idString) return null;
	const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

	const { data: product, error, isLoading } = useItem(id);

	const addToCart = () => {
		if (!product) return;

		addProduct(product);
		router.push("cart");
	};

	if (isLoading) {
		return <ActivityIndicator />;
	}

	if (error) {
		return <Text>Failed to fetch products</Text>;
	}

	return (
		<View style={styles.container}>
			<Stack.Screen options={{ title: product?.name }} />
			<RemoteImage
				path={product?.img}
				fallback={defaultPizzaImage}
				style={styles.image}
			/>

			<Text>Select size</Text>

			<Text style={styles.price}>€ {product?.price}</Text>

			<Button onPress={addToCart} text="Add to cart" />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.light.background,
		flex: 1,
		padding: 10,
	},
	image: {
		width: "100%",
		aspectRatio: 1,
	},
	price: {
		fontSize: 18,
		fontWeight: "bold",
		marginTop: "auto",
	},
	sizes: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginVertical: 10,
	},
	size: {
		backgroundColor: "gainsboro",
		width: 50,
		aspectRatio: 1,
		borderRadius: 25,
		alignItems: "center",
		justifyContent: "center",
	},
	sizeText: {
		fontSize: 20,
		fontWeight: "500",
	},
});

export default ProductDetailsScreen;
