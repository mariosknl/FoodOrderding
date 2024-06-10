import { shopInfo } from "@assets/data/restaurant";
import Button from "@/components/Button";
import Colors from "@/constants/Colors";
import { useBasketStore } from "@store/basketStore";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
	Dimensions,
	Image,
	ListRenderItem,
	Pressable,
	SectionList,
	StyleSheet,
	Text,
	View,
} from "react-native";
import Animated, {
	interpolate,
	useAnimatedRef,
	useAnimatedStyle,
	useScrollViewOffset,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const CategoryPage = () => {
	const { category } = useLocalSearchParams();
	const { items, total } = useBasketStore();

	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollViewOffset(scrollRef);
	const navigation = useNavigation();

	const imageAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: interpolate(
						scrollOffset.value,
						[-IMG_HEIGHT, 0, IMG_HEIGHT],
						[-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.7]
					),
				},
				{
					scale: interpolate(
						scrollOffset.value,
						[-IMG_HEIGHT, 0, IMG_HEIGHT],
						[2, 1, 1]
					),
				},
			],
		};
	});

	const headerAnimatedStyle = useAnimatedStyle(() => {
		return {
			opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
		};
	});

	// Function to get products for a specific category
	const getCategoryProducts = (categoryName: string) => {
		const category = shopInfo.products.find(
			(item) => item.category === categoryName
		);

		if (!category) {
			return [];
		}

		return category.types.map((type, index) => ({
			title: type.category,
			data: type.items,
			index,
		}));
	};

	const products = getCategoryProducts(category as string);

	const renderItem: ListRenderItem<any> = ({ item, index }) => (
		<Link
			href={{
				pathname: "(user)/menu/(modal)/[product]",
				params: { id: item.id, category: category as string },
			}}
			asChild
		>
			<Pressable key={index} style={styles.item}>
				<View style={{ flex: 1 }}>
					<Text style={styles.dish}>{item.name}</Text>
					<Text style={styles.dishText}>{item.info}</Text>
					<Text style={styles.dishText}>€{item.price}</Text>
				</View>
				<Image source={item.img} style={styles.dishImage} />
			</Pressable>
		</Link>
	);

	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					headerTransparent: true,
					headerTitle: "",
					headerLeft: () => (
						<Pressable
							onPress={() => navigation.goBack()}
							style={({ pressed }) => [
								styles.arrowBack,
								pressed && { opacity: 0.5 },
							]}
						>
							<Ionicons name="arrow-back" size={24} />
						</Pressable>
					),
					headerBackground: () => (
						<Animated.View style={[styles.header, headerAnimatedStyle]} />
					),
				}}
			/>
			<Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
				<Animated.Image
					source={products[0].data[0].img}
					style={[styles.image, imageAnimatedStyle]}
				/>

				<View style={styles.detailsContainer}>
					<Text style={styles.restaurantName}>{category}</Text>
					<SectionList
						contentContainerStyle={{ paddingBottom: 50 }}
						keyExtractor={(item, index) => `${item.id}-${index}`}
						scrollEnabled={false}
						sections={products}
						renderItem={renderItem}
						renderSectionHeader={({ section: { title } }) => (
							<Text style={styles.sectionHeader}>{title}</Text>
						)}
						ItemSeparatorComponent={() => (
							<View
								style={{
									height: 1,
									backgroundColor: Colors.grey,
									marginHorizontal: 16,
								}}
							/>
						)}
						SectionSeparatorComponent={() => (
							<View style={{ height: 1, backgroundColor: Colors.grey }} />
						)}
					/>
				</View>
			</Animated.ScrollView>

			<StatusBar style="light" />
		</View>
	);
};
export default CategoryPage;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	detailsContainer: {
		backgroundColor: Colors.lightGrey,
	},
	image: {
		width,
		height: IMG_HEIGHT,
	},
	text: {
		fontSize: 20,
		fontWeight: "bold",
		textAlign: "center",
	},
	arrowBack: {
		backgroundColor: Colors.lightGrey,
		padding: 2,
		borderRadius: 50,
		opacity: 0.8,
	},
	header: {
		backgroundColor: Colors.white,
		height: 100,
	},
	restaurantName: {
		fontSize: 30,
		margin: 16,
		textAlign: "center",
	},
	restaurantDescription: {
		fontSize: 16,
		margin: 16,
		lineHeight: 22,
		color: Colors.medium,
	},
	sectionHeader: {
		fontSize: 22,
		fontWeight: "bold",
		margin: 16,
		marginTop: 10,
	},
	item: {
		backgroundColor: "white",
		padding: 16,
		flexDirection: "row",
		justifyContent: "space-between",
		marginHorizontal: 16,
		marginVertical: 8,
	},
	dishImage: {
		width: 80,
		height: 80,
		borderRadius: 4,
	},
	dish: {
		fontSize: 16,
		fontWeight: "bold",
	},
	dishText: {
		fontSize: 14,
		color: Colors.mediumDark,
		paddingVertical: 4,
	},
	stickySegments: {
		position: "absolute",
		height: 50,
		left: 0,
		right: 0,
		top: 100,
		backgroundColor: "#fff",
		overflow: "hidden",
		paddingBottom: 10,
	},
	segmentsShadow: {
		backgroundColor: "#fff",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
		width: "100%",
		height: "100%",
	},
	segmentButton: {
		paddingHorizontal: 16,
		paddingVertical: 4,
		borderRadius: 20,
	},
	segmentText: {
		color: Colors.primary,
		fontSize: 16,
	},
	segmentButtonActive: {
		backgroundColor: Colors.primary,
		paddingHorizontal: 16,
		paddingVertical: 4,
		borderRadius: 20,
		marginHorizontal: 8,
	},
	segmentTextActive: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
	segmentScrollview: {
		paddingHorizontal: 16,
		alignItems: "center",
		gap: 20,
		paddingBottom: 4,
	},
	button: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		padding: 8,
		zIndex: 100,
	},
});
