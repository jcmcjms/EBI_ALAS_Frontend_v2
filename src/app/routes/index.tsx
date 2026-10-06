import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginPage } from '@/app/login-page';
import { getSession } from '@/features/auth/api/session';

export const Route = createFileRoute('/')({
	beforeLoad: async () => {
		if (await getSession()) {
			throw redirect({ to: '/dashboard' });
		}
	},
	component: LoginPage,
});