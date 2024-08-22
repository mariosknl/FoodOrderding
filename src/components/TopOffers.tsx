import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { Link } from "expo-router";
import { shopInfo } from "@assets/data/restaurant";
import { StatusBar } from "expo-status-bar";

/**
 * A component that renders a horizontal scroll view of top offers.
 *
 * This component fetches an array of offers from `shopInfo.products[2].types[0].items` and maps over it to display each offer. Each offer is wrapped in a `Link` component for navigation, though the `href` is currently set to an empty string. The offers are displayed as cards with an image, name, price, and additional info.
 *
 * - The `ScrollView` is horizontal and hides the horizontal scroll indicator.
 * - Each offer card contains an image (`Image` component), and a box (`View` component) that includes the offer's name, price, and info.
 * - The `StatusBar` component is set to "light" style, which may indicate the component is intended for use within a dark theme or dark mode.
 */
const TopOffers = () => {
  const offers = shopInfo.products[2].types[0].items;
  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          padding: 15,
        }}
      >
        {offers.map((offer) => (
          <Link
            key={offer.id}
            href={{
              pathname: "/(user)/menu/[id]",
              params: {
                id: offer.id,
                category: offer.name,
                product: offer.name,
              },
            }}
            asChild
          >
            <Pressable>
              <View className="w-[200px] h-[200px] bg-white mr-2 shadow-md rounded">
                <Image
                  source={offer.img}
                  className="flex-5 w-full h-24"
                  resizeMode="contain"
                />

                <View className="flex-2 p-[10px]">
                  <Text className="py-1 text-sm font-bold">{offer.name}</Text>
                  <Text className="text-[16px] font-bold py-1 text-black">
                    € {offer.price}
                  </Text>
                  <Text className="text-sm text-black">{offer.info}</Text>
                </View>
              </View>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
      <StatusBar style="light" />
    </>
  );
};

export default TopOffers;
