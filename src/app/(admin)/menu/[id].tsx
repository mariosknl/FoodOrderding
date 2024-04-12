import { useCart } from "@/app/providers/CartProvider";
import Button from "@/components/Button";
import { defaultPizzaImage } from "@/components/ProductListItem";
import Colors from "@/constants/Colors";
import { PizzaSize } from "@/types";
import products from "@assets/data/products";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

const ProductDetailsScreen = () => {
	const { id } = useLocalSearchParams();
	const { addItem } = useCart();

	const router = useRouter();

	const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");

	const product = products.find((p) => p.id.toString() === id);

	const addToCart = () => {
		if (!product || !selectedSize) return;

		addItem(product, selectedSize);
		router.push("/cart");
	};

	if (!product) {
		return <Text>Product not found</Text>;
	}

	return (
		<View style={styles.container}>
			<Stack.Screen options={{ title: product.name }} />
			<Image
				source={{ uri: product.image ?? defaultPizzaImage }}
				style={styles.image}
			/>

			<Text style={styles.title}>€ {product.name}</Text>
			<Text style={styles.price}>€ {product.price}</Text>

			{/* <Button onPress={addToCart} text="Add to cart" /> */}
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
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
});

export default ProductDetailsScreen;
