import { useItem } from "@/api/products";
import RemoteImage from "@/components/RemoteImage";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

/**
 * The `ProductDetailsScreen` component inside the `admin` folder is designed for the administrative interface of a food ordering app,
 * providing functionalities for viewing and editing the details of a specific product. This screen is typically accessed by selecting
 * a product from a list within the admin panel, allowing for detailed management of product information such as name, description,
 * price, and availability.
 *
 * Key features of the `admin` `ProductDetailsScreen` include:
 * - Fetching detailed information about a product using its unique identifier (ID), which is passed as a route parameter.
 * - Providing a form or interface for editing the product's details, including text inputs for name and description, a numeric input
 *   for price, and toggles or dropdowns for availability status.
 * - Implementing validation and error handling to ensure that product information is correctly entered and saved.
 * - Offering options to save changes, delete the product, or cancel edits, with appropriate confirmations to prevent accidental data loss.
 * - Integrating with the backend or database to update product information in real-time, reflecting changes immediately in the user-facing app.
 *
 * This component is essential for administrators to manage the product offerings of the food ordering app, ensuring that the menu remains
 * accurate and up-to-date.
 */
const ProductDetailsScreen = () => {
  const { id, category } = useLocalSearchParams();
  const navigation = useNavigation();

  if (!id || Array.isArray(id)) return;

  const { data: product } = useItem(parseFloat(id));

  if (!product) return;

  return (
    <View className="bg-white flex-1">
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

      <View className="p-[10px]">
        <Text className="text-[18px font-JakartaSemiBold my-3">
          {product.name}
        </Text>
        <Text className="font-JakartaBold mt-auto text-black">
          €{product.price}
        </Text>
        <Text className="text-black text-md">{product.info}</Text>
      </View>
    </View>
  );
};
export default ProductDetailsScreen;

const styles = StyleSheet.create({
  image: {
    width,
    aspectRatio: 1,
  },
});
