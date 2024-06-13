import {
	ActivityIndicator,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import Colors from "@/constants/Colors";
import { Link, useSegments } from "expo-router";
import { useCategoryList } from "@/api/products";
import RemoteImage from "./RemoteImage";
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
