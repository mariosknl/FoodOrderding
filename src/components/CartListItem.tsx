import { useBasketStore } from "@/store/basketStore";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { Product } from "../types";
import { defaultPizzaImage } from "./ProductListItem";
import RemoteImage from "./RemoteImage";

type CartListItemProps = {
  cartItem: (Product & { quantity: number }) | null;
};

/**
 * Renders a single item in the shopping cart.
 *
 * This component displays the cart item's image, name, and price. It also includes a quantity selector
 * allowing the user to increase or decrease the quantity of the cart item. The component uses the `useBasketStore`
 * hook to access the `updateProduct` function, which is called when the quantity is changed.
 *
 * @returns {React.ReactElement | null} The cart list item component or null if `cartItem` is not provided.
 */
const CartListItem: React.FC<CartListItemProps> = ({ cartItem }) => {
  const { updateProduct } = useBasketStore();

  if (!cartItem) return null;

  return (
    <View className="flex-1 bg-white rounded-[10px] p-[5px] flex flex-row items-center">
      <RemoteImage
        path={cartItem?.img}
        fallback={defaultPizzaImage}
        resizeMode="contain"
        className="w-[75px] aspect-square self-center mr-4"
      />
      <View className="flex--1">
        <Text className="font-JakartaSemiBold text-[16px] mb-[5px]">
          {cartItem?.name}
        </Text>
        <View className="flex flex-row gap-[5px]">
          <Text className="text-basic font-JakartaBold">
            ${cartItem?.price?.toFixed(2)}
          </Text>
        </View>
      </View>
      <View className="flex flex-row gap-[10px] items-center my-[10px]">
        <FontAwesome
          onPress={() => updateProduct(cartItem, -1)}
          name="minus"
          color="gray"
          className="p-[5px]"
        />

        <Text className="font-JakartaSemiBold text-lg">
          {cartItem?.quantity}
        </Text>
        <FontAwesome
          onPress={() => updateProduct(cartItem, 1)}
          name="plus"
          color="gray"
          className="p-[5px]"
        />
      </View>
    </View>
  );
};

export default CartListItem;
