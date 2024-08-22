import { Tables } from "@/database.types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import { defaultPizzaImage } from "./ProductListItem";
import RemoteImage from "./RemoteImage";

type OrderItemListItemProps = {
  item: { items: Tables<"items"> | null } & Tables<"order_items">;
};

/**
 * Renders a single item within an order list.
 *
 * This component displays the item's image, name, and price, along with the quantity of the item ordered.
 * It uses a `RemoteImage` component to load the item's image, providing a fallback image if the main image fails to load.
 * The item's name and price are displayed next to the image, and the quantity is shown on the right side of the item.
 *
 * @param {Object} props - Component props.
 * @param {OrderItemListItemProps} props.item - The order item to display. Contains information like the image path, name, price, and quantity.
 * @returns {React.ReactElement} The order item list item component.
 */
const OrderItemListItem: React.FC<OrderItemListItemProps> = ({ item }) => {
  return (
    <View className="bg-white rounded-[10px] flex flex-row items-center p-[5px]">
      <RemoteImage
        path={item?.items?.img}
        fallback={defaultPizzaImage}
        resizeMode="contain"
        className="w-[75px] aspect-square self-center mr-[10px]"
      />
      <View className="flex-1">
        <Text className="font-JakartaSemiBold text-[16px] mb-[5px]">
          {item.items?.name}
        </Text>
        <View className="flex flex-row gap-[5px]">
          <Text className="bg-basic font-JakartaBold">
            €{item.items?.price}
          </Text>
        </View>
      </View>
      <View className="flex flex-row gap-[10px] items-center mt-[10px]">
        <Text className="font-JakartaSemiBold text-lg">{item?.quantity}</Text>
      </View>
    </View>
  );
};

export default OrderItemListItem;
