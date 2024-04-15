import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { registerForPushNotificationsAsync } from "@lib/notifications";
import { ExpoPushToken } from "expo-notifications";
import * as Notifications from "expo-notifications";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthProvider";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

const NotificationProvider = ({ children }: PropsWithChildren) => {
	const [expoPushToken, setExpoPushToken] = useState("");
	const [notification, setNotification] = useState<
		Notifications.Notification | undefined
	>(undefined);
	const notificationListener = useRef<Notifications.Subscription>();
	const responseListener = useRef<Notifications.Subscription>();

	const { profile } = useAuth();
	console.log(profile);

	const savePushToken = async (newToken: string) => {
		setExpoPushToken(newToken);

		// update the token in the db
		if (!newToken) {
			return;
		}
		await supabase
			.from("profiles")
			.update({ expo_push_token: newToken })
			.eq("id", profile?.id);
	};

	useEffect(() => {
		registerForPushNotificationsAsync()
			.then((token) => savePushToken(token ?? ""))
			.catch((error: any) => setExpoPushToken(`${error}`));

		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				setNotification(notification);
			});

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener((response) => {
				console.log(response);
			});

		return () => {
			if (notificationListener.current) {
				notificationListener.current &&
					Notifications.removeNotificationSubscription(
						notificationListener.current
					);
			}

			if (responseListener.current) {
				responseListener.current &&
					Notifications.removeNotificationSubscription(
						responseListener.current
					);
			}
		};
	}, []);

	console.log("Push token:", expoPushToken);
	console.log("Notification", notification);

	return <>{children}</>;
};

export default NotificationProvider;
