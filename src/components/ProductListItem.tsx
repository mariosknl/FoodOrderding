import { Tables } from "@/database.types";
import Colors from "@constants/Colors";
import { Link, useSegments } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import RemoteImage from "./RemoteImage";

type ProductListItemProps = {
	product: Tables<"items">;
};

export const defaultPizzaImage =
	"https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

/**
 * A component that renders a single product item in a list.
 *
 * This component displays a product's image, name, and price. If the product's image is not available, a default pizza image is used as a fallback. The entire item is wrapped in a `Link` component, making it clickable and navigable to the product's detailed page. The URL path is dynamically constructed using a segment from `useSegments` and the product's ID.
 *
 * @param {Object} props - Component props.
 * @param {ProductListItemProps} props.product - The product data to display, including its image, name, and price.
 * @returns {React.ReactElement} A pressable, navigable list item displaying details of a product.
 */
const ProductListItem = ({ product }: ProductListItemProps) => {
	const segments = useSegments();

	return (
		<Link href={`/${segments[0]}/menu/${product.id}`} asChild>
			<Pressable style={styles.container}>
				<RemoteImage
					path={product.img}
					fallback={defaultPizzaImage}
					style={styles.image}
					resizeMode="contain"
				/>
				<Text style={styles.title}>{product.name}</Text>
				<Text style={styles.price}>€ {product.price}</Text>
			</Pressable>
		</Link>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.light.background,
		padding: 10,
		borderRadius: 20,
		flex: 1,
		maxWidth: "50%",
	},

	image: {
		width: "100%",
		aspectRatio: 1,
	},

	title: {
		fontSize: 18,
		fontWeight: "600",
		marginVertical: 10,
	},
	price: {
		color: Colors.light.tint,
		fontWeight: "bold",
	},
});

export default ProductListItem;
