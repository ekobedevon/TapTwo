import { PLUNK_KEY, SITE_URL } from '$env/static/private';
import { createEmailVerfication } from '$lib/utils/AuthDB';
import { nanoid } from 'nanoid';

export const validateEmail = (email: string) => {
	const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
	return emailPattern.test(email);
};

export const sendResetEmail = async (email: string | null, name: string, id: string) => {
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${PLUNK_KEY}`
		},
		body: JSON.stringify({
			to: email,
			subject: 'Password Reset',
			body: `Hello ${name}! \n Reset your password at ${SITE_URL}/auth/verify/${id}`,
			headers: {}
		})
	};

	fetch('https://api.useplunk.com/v1/send', options)
		.then((response) => response.json())
		.then((response) => console.log(response))
		.catch((err) => console.error(err));
};

export const sendVerifyEmail = async (email: string, name: string, user_id: string) => {
	const email_details = {
		code: nanoid(20),
		id: nanoid(10),
		expires_at: new Date(Date.now() + 1000 * 60 * 20), //Expires in 20 Minutes
		user_id,
		email
	};

	createEmailVerfication(email_details);

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${PLUNK_KEY}`
		},
		body: JSON.stringify({
			to: email_details.email,
			subject: 'Email Verification',
			body: `Welcome to Map market! \nPlease verify your email at ${SITE_URL}/auth/verify/${email_details.code}`,
			headers: {}
		})
	};

	fetch('https://api.useplunk.com/v1/send', options)
		.then((response) => response.json())
		.then((response) => console.log(response))
		.catch((err) => console.error(err));
};
