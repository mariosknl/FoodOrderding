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
				<Text style={styles.info}>€{product.info}</Text>

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
