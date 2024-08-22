import { Tables } from "@/database.types";
import { Link, useSegments } from "expo-router";
import { Pressable, Text } from "react-native";
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
      <Pressable className="bg-white p-[10px] flex-1 max-w-[50%] rounded-[20px]">
        <RemoteImage
          path={product.img}
          fallback={defaultPizzaImage}
          className="w-full aspect-square"
          resizeMode="contain"
        />
        <Text className="text-lg font-JakartaSemiBold my-[10px]">
          {product.name}
        </Text>
        <Text className="font-JakartaBold text-[#2f95dc]">
          € {product.price}
        </Text>
      </Pressable>
    </Link>
  );
};

export default ProductListItem;
