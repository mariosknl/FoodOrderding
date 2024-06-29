import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Platform } from "react-native";

/**
 * A component that creates a link for external URLs, utilizing an in-app browser for native platforms.
 *
 * This component wraps the `Link` component from `expo-router` and extends its functionality to open external URLs
 * in an in-app browser on native platforms (iOS and Android) instead of the default browser. On web platforms, it behaves
 * like a regular link. It uses the `expo-web-browser` package to handle opening URLs in an in-app browser.
 *
 * @param {Object} props - The props for the ExternalLink component.
 * @param {string} props.href - The URL to be opened.
 * @returns {React.ReactElement} A link component that opens the provided URL in an in-app browser on native platforms.
 */
export function ExternalLink(
	props: Omit<React.ComponentProps<typeof Link>, "href"> & { href: string }
) {
	return (
		<Link
			target="_blank"
			{...props}
			// @ts-expect-error: External URLs are not typed.
			href={props.href}
			onPress={(e) => {
				if (Platform.OS !== "web") {
					// Prevent the default behavior of linking to the default browser on native.
					e.preventDefault();
					// Open the link in an in-app browser.
					WebBrowser.openBrowserAsync(props.href as string);
				}
			}}
		/>
	);
}
