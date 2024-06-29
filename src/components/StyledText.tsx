import { Text, TextProps } from "./Themed";

/**
 * A wrapper component for the `Text` component that applies a monospace font style.
 *
 * This component takes all the properties of the `Text` component and adds a specific font family (`SpaceMono`) to it,
 * making the text appear in monospace. This is useful for displaying code or other content where fixed-width characters are desirable.
 *
 * @param {TextProps} props - The properties passed to the `Text` component, along with any additional styling.
 * @returns {React.ReactElement} A `Text` component with the monospace font applied.
 */
export function MonoText(props: TextProps) {
	return <Text {...props} style={[props.style, { fontFamily: "SpaceMono" }]} />;
}
