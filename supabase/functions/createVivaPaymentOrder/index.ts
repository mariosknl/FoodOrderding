// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("EXPO_PUBLIC_SUPABASE_URL") ?? "";
const supabaseAnonKey = Deno.env.get("EXPO_PUBLIC_ANON_KEY") ?? "";
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

const clientId = Deno.env.get("EXPO_VIVA_CLIENT_ID");
const clientSecret = Deno.env.get("EXPO_VIVA_CLIENT_SECRET");

if (!clientId || !clientSecret) {
	throw new Error(
		"Client ID or Client Secret is not set in environment variables."
	);
}

// Encode credentials
const encodedCredentials = btoa(`${clientId}:${clientSecret}`);

Deno.serve(async (req) => {
	try {
		const authHeader = req.headers.get("Authorization")!;
		const token = authHeader.replace("Bearer ", "");
		const { data } = await supabaseClient.auth.getUser(token);
		const user = data.user;
		// Step 1: Extract the Transaction ID from the request
		const { transactionId } = await req.json();

		// Step 2: Set up the request to Viva Wallet API
		const vivaWalletApiUrl = `https://demo-api.vivapayments.com/checkout/v2/transactions/${transactionId}`;
		const requestHeaders = new Headers({
			Authorization: `Bearer ${encodedCredentials}`,
			"Content-Type": "application/json",
		});

		// Step 3: Make the HTTP request to Viva Wallet API
		const vivaResponse = await fetch(vivaWalletApiUrl, {
			method: "GET",
			headers: requestHeaders,
		});

		// Step 4: Handle the response from Viva Wallet API
		if (!vivaResponse.ok) {
			throw new Error(
				"Failed to retrieve transaction details from Viva Wallet"
			);
		}
		const transactionDetails = await vivaResponse.json();

		// Respond with the transaction details
		return new Response(JSON.stringify({ user, transactionDetails }), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		return new Response(
			JSON.stringify({
				error: error.message,
			}),
			{
				headers: { "Content-Type": "application/json" },
				status: 500,
			}
		);
	}
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/createVivaPaymentOrder' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
