import { forwardRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "@constants/Colors";

type ButtonProps = {
  text: string;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

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
        <Text style={styles.text}>{text}</Text>
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
