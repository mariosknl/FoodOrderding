import { useCategoryList } from "@/api/products";
import Colors from "@/constants/Colors";
import { Link, useSegments } from "expo-router";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import RemoteImage from "./RemoteImage";

/**
 * Displays a horizontal scroll view of category cards fetched from a category list.
 *
 * This component first attempts to fetch a list of categories using the `useCategoryList` hook. It handles loading states,
 * errors, and the absence of categories gracefully. Each category card displays an image (with a fallback to a default image if necessary)
 * and the category name. Clicking on a category card navigates the user to a detailed view of items within that category.
 *
 * @returns {React.ReactElement | null} A horizontal scroll view of category cards, or null if no categories are available.
 */
const Categories = () => {
	const segments = useSegments();
	const { data: categories, error, isLoading } = useCategoryList();

	if (isLoading) <ActivityIndicator />;

	if (error) <Text>Failed to fetch categories</Text>;

	if (!categories) return null;

	if (error) {
		return <Text>Failed to fetch categories</Text>;
	}

	let imageSource = require("@assets/images/defaultΙmage.png");

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{
				padding: 15,
			}}
		>
			{categories.map(({ category_image, name, id }) => (
				<Link
					key={id}
					href={{
						pathname: `/${segments[0]}/menu/category/${name}`,
						params: { id, category_image },
					}}
				>
					<View style={styles.categoryCard}>
						<RemoteImage
							path={category_image}
							style={styles.image}
							fallback={imageSource}
						/>
						<Text style={styles.categoryText}>{name}</Text>
					</View>
				</Link>
			))}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	categoryCard: {
		width: 100,
		height: 100,
		backgroundColor: Colors.white,
		margin: 10,
		elevation: 2,
		shadowColor: Colors.black,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.06,
		borderRadius: 4,
	},
	categoryText: {
		padding: 5,
		fontSize: 14,
		fontWeight: "bold",
		textAlign: "center",
	},
	image: {
		width: 100,
		height: 70,
		borderTopLeftRadius: 4,
		borderTopRightRadius: 4,
	},
});

export default Categories;
