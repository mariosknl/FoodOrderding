import { useItem } from "@/api/products";
import RemoteImage from "@/components/RemoteImage";
import Colors from "@/constants/Colors";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

const ProductDetailsScreen = () => {
	const { id, category } = useLocalSearchParams();
	const navigation = useNavigation();

	if (!id || Array.isArray(id)) return;

	const { data: product } = useItem(parseFloat(id));

	if (!product) return;

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
					headerRight: () => (
						<Link href={`/(admin)/menu/create?id=${id}}`} asChild>
							<Pressable>
								{({ pressed }) => (
									<FontAwesome
										name="pencil"
										size={25}
										color={Colors.light.tint}
										style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
									/>
								)}
							</Pressable>
						</Link>
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
		marginBottom: 10,
	},
	price: {
		color: Colors.primary,
		fontWeight: "bold",
	},
	info: {
		color: Colors.black,
		fontSize: 16,
	},
});