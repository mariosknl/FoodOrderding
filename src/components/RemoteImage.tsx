import React, { ComponentProps, useEffect, useState } from "react";
import { Image } from "react-native";
import { supabase } from "../lib/supabase";

type RemoteImageProps = {
	path?: string | null;
	fallback: string;
} & Omit<ComponentProps<typeof Image>, "source">;

/**
 * A component for displaying an image from a remote source with a fallback option.
 *
 * This component attempts to load an image from a specified path using Supabase Storage. If the path is not provided,
 * or if loading the image fails, a fallback image is displayed instead. The component leverages React's `useState` and `useEffect`
 * hooks to manage the image's loading state and to perform the asynchronous image fetching operation.
 *
 * @param {RemoteImageProps} props - The properties passed to the component.
 * @param {string | null} props.path - The path to the remote image in Supabase Storage.
 * @param {string} props.fallback - The URL to the fallback image to be displayed if the remote image cannot be loaded.
 * @param {ComponentProps<typeof Image>} imageProps - Additional props to be passed to the underlying `Image` component.
 * @returns {React.ReactElement} An image element that displays either the remote image or a fallback image.
 */
const RemoteImage = ({ path, fallback, ...imageProps }: RemoteImageProps) => {
	const [image, setImage] = useState("");

	useEffect(() => {
		if (!path) return;
		(async () => {
			setImage("");
			const { data, error } = await supabase.storage
				.from("product-images")
				.download(path);
			// .download(path, { transform: { width: 50, height: 50 } });

			if (error) {
				console.log(error);
			}

			if (data) {
				const fr = new FileReader();
				fr.readAsDataURL(data);
				fr.onload = () => {
					setImage(fr.result as string);
				};
			}
		})();
	}, [path]);

	if (!image) {
	}

	return <Image source={{ uri: image || fallback }} {...imageProps} />;
};

export default RemoteImage;
