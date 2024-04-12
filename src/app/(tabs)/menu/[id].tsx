import { defaultPizzaImage } from "@/components/ProductListItem";
import Colors from "@/constants/Colors";
import products from "@assets/data/products";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";

const sizes = ["S", "M", "L", "XL"];

const ProductDetailsScreen = () => {
	const { id } = useLocalSearchParams();

	const [selectedSize, setSelectedSize] = useState("");

	const product = products.find((p) => p.id.toString() === id);

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

			<Text>Select size</Text>
			<View style={styles.sizes}>
				{sizes.map((size) => (
					<Pressable
						key={size}
						style={[
							styles.size,
							{
								backgroundColor: selectedSize === size ? "gainsboro" : "white",
							},
						]}
						onPress={() => setSelectedSize(size)}
					>
						<Text
							style={[
								styles.sizeText,
								{
									color: selectedSize === size ? "black" : "gray",
								},
							]}
						>
							{size}
						</Text>
					</Pressable>
				))}
			</View>

			<Text style={styles.price}>€ {product.price}</Text>
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
