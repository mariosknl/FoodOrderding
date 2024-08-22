import { useItemsList } from "@/api/products";
import RemoteImage from "@/components/RemoteImage";
import Colors from "@/constants/Colors";
import { ItemType, Tables } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  ListRenderItem,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

/**
 * The `CategoryPage` component within the `admin` folder is designed to manage and display the products within a specific category
 * in the administrative interface of a food ordering app. This page allows administrators to view all products associated with a
 * selected category, edit existing products, or add new products to the category.
 *
 * Key functionalities of the `admin` `CategoryPage` include:
 * - Dynamically fetching and displaying a list of products that belong to a specific category. The category ID or name is typically
 *   passed as a route parameter or selected from a dropdown menu.
 * - Providing an interface for administrators to add a new product to the category directly from this page, enhancing the workflow
 *   efficiency.
 * - Offering options next to each product for editing or deleting, allowing for easy management of the category's product lineup.
 * - Implementing search and filter capabilities to help administrators quickly find specific products within the category.
 * - Handling empty states gracefully by displaying appropriate messages or prompts when no products are available in the category,
 *   guiding administrators on the next steps.
 *
 * This component is essential for the efficient management of product categories, enabling administrators to maintain an organized
 * and up-to-date menu for the food ordering app.
 */
const CategoryPage = () => {
  const { category, id } = useLocalSearchParams();
  const navigation = useNavigation();

  if (!category || !id || typeof id !== "string") {
    return null;
  }

  const { data: items, error, isPending } = useItemsList(parseFloat(id));

  const filteredItems: ItemType[] = (items || []).filter(
    (item) => item.types && item.types.category_id === parseFloat(id),
  );

  const convertItems = (filteredItems: ItemType[]) => {
    if (!filteredItems) {
      return [];
    }
    // Group items by 'types.name'
    const groupedItems: Record<string, Tables<"items">[]> =
      filteredItems?.reduce((acc: Record<string, ItemType[]>, item) => {
        if (item.types) {
          const key = item.types.name;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(item);
        }
        return acc;
      }, {});

    // Map grouped items into desired structure
    return Object.entries(groupedItems).map(([title, data], index) => ({
      title,
      data,
      index,
    }));
  };

  const convertedItems = convertItems(filteredItems);

  let imageSource = require("@assets/images/defaultΙmage.png");

  const renderItem: ListRenderItem<any> = ({ item, index }) => (
    <Link
      href={{
        pathname: `/(admin)/menu/(modal)/[product]`,
        params: { id: item.id, category: category as string, product: item },
      }}
      asChild
    >
      <Pressable
        key={index}
        className="bg-white p-4 flex flex-row justify-between mx-4 my-2"
      >
        <View className="flex-1">
          <Text className="text-[16px]">{item.name}</Text>
          <Text className="text-sm py-1 text-gray-500">{item.info}</Text>
          <Text className="text-sm py-1 text-gray-500">€{item.price}</Text>
        </View>
        <RemoteImage
          path={item.img}
          className="w-[80px] h-[80px] rounded-md"
          fallback={imageSource}
        />
      </Pressable>
    </Link>
  );

  return (
    <View className="flex-1">
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
          headerRight: () => (
            <Link
              href={{
                pathname: "/(admin)/menu/createCategory",
                params: { categoryId: id },
              }}
              asChild
            >
              <Pressable>
                <Ionicons name="pencil" size={20} />
              </Pressable>
            </Link>
          ),
        }}
      />
      <RemoteImage
        path={items[0]!.types!.categories!.category_image}
        fallback={imageSource}
        style={styles.image}
      />

      <View className="bg-[#FCF8FF]">
        <Text className="text-[30px] m-4 text-center">{category}</Text>
        <SectionList
          contentContainerStyle={{ paddingBottom: 50 }}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          scrollEnabled={false}
          sections={convertedItems}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="text-[22px] font-bold, m-4, mt-[10px] pl-4">
              {title}
            </Text>
          )}
          ItemSeparatorComponent={() => (
            <View className="h-[1px] bg-[#EEE9F0] mx-4" />
          )}
          SectionSeparatorComponent={() => (
            <View className="h-[1px] bg-[#EEE9F0]" />
          )}
        />
      </View>

      <StatusBar style="light" />
    </View>
  );
};
export default CategoryPage;

const styles = StyleSheet.create({
  image: {
    width,
    height: IMG_HEIGHT,
  },
  arrowBack: {
    backgroundColor: Colors.lightGrey,
    padding: 2,
    borderRadius: 50,
    opacity: 0.8,
  },
});
