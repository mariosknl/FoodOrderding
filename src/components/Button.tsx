import { forwardRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "@constants/Colors";

type ButtonProps = {
  text: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const getBgVariantStyle = (variant: ButtonProps["bgVariant"]) => {
  switch (variant) {
    case "secondary":
      return "bg-gray-500";
    case "danger":
      return "bg-red-500";
    case "success":
      return "bg-green-500";
    case "outline":
      return "bg-transparent border-neutral-300 border-[0.5px]";
    default:
      return "bg-[#0286FF]";
  }
};

const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
  switch (variant) {
    case "primary":
      return "text-black";
    case "secondary":
      return "text-gray-100";
    case "danger":
      return "text-red-100";
    case "success":
      return "text-green-100";
    default:
      return "text-white";
  }
};

/**
 * A customizable button component for React Native applications.
 *
 * This component utilizes `forwardRef` to provide access to the `Pressable` component's ref, allowing for more flexible use cases such as managing focus or animations. It combines the `Pressable` component with custom styling and text rendering. The button's appearance and behavior can be customized through the `Pressable` component's props.
 *
 * @component
 * @param {Object} props - The properties passed to the Button component.
 * @param {string} props.text - The text to be displayed on the button.
 * @param {React.ComponentPropsWithoutRef<typeof Pressable>} pressableProps - Props spread onto the `Pressable` component, allowing for customization of all `Pressable` behaviors such as `onPress`, `onLongPress`, etc.
 * @param {React.Ref<View | null>} ref - A ref to the underlying `Pressable` component for direct access if needed.
 * @returns {React.ReactElement} A styled button element with text.
 */
const Button = forwardRef<View | null, ButtonProps>(
  ({ text, disabled, onPress, ...pressableProps }, ref) => {
    return (
      <Pressable
        ref={ref}
        {...pressableProps}
        onPress={disabled ? undefined : onPress} // Prevent onPress when disabled
        style={({ pressed }) => [
          styles.container,
          disabled && styles.disabled,
          pressed && !disabled && styles.pressed, // Optional: Add a pressed state style
        ]}
      >
        <Text
          className={`text-[16px] font-JakartaSemiBold text-white ${getTextVariantStyle}`}
        >
          {text}
        </Text>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    alignItems: "center",
    borderRadius: 100,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
});

export default Button;
