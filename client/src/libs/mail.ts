import { BASE_URL } from "@/utils";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
	const confirmLink = `${BASE_URL}/new-verification?token=${token}`;

	await resend.emails.send({
		from: "e-book-store.noreply <onboarding@resend.dev>",
		to: email,
		subject: "Confirm your email",
		html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
	});
}
