import { useStore } from "@/store/store";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
	const { session } = useStore();

	if (session) {
		return <Redirect href={"/"} />;
	}

	return <Stack />;
}
