'use server';

import {mutate} from '@/platform/vendure/api';
import {LoginMutation, RegisterCustomerAccountMutation} from '@/features/authentication/graphql';
import {setAuthToken} from '@/platform/vendure/auth-token';
import {redirect} from '@/platform/i18n/navigation';
import {revalidatePath} from 'next/cache';
import {getLocale, getTranslations} from 'next-intl/server';

export async function registerAction(prevState: { error?: string } | undefined, formData: FormData) {
    const t = await getTranslations('Errors');
    const emailAddress = formData.get('emailAddress') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const password = formData.get('password') as string;
    const redirectTo = formData.get('redirectTo') as string | null;

    if (!emailAddress || !password) {
        return {error: t('emailPasswordRequired')};
    }

    const result = await mutate(RegisterCustomerAccountMutation, {
        input: {
            emailAddress,
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            phoneNumber: phoneNumber || undefined,
            password,
        }
    });

    const registerResult = result.data.registerCustomerAccount;

    if (registerResult.__typename !== 'Success') {
        return {error: registerResult.message};
    }

    const locale = await getLocale();

    // Attempt immediate login (succeeds when requireVerification is false)
    try {
        const loginResult = await mutate(LoginMutation, {
            username: emailAddress,
            password,
        }, { useAuthToken: true });

        if (loginResult.data.login.__typename === 'CurrentUser') {
            if (loginResult.token) {
                await setAuthToken(loginResult.token);
            }
            revalidatePath(`/${locale}`, 'layout');
            const safeRedirect = redirectTo?.startsWith('/') && !redirectTo.startsWith('//')
                ? redirectTo
                : '/account';
            redirect({href: safeRedirect, locale});
        }
    } catch (e) {
        // Allow Next.js NEXT_REDIRECT to propagate normally
        if ((e as any)?.digest?.startsWith('NEXT_REDIRECT')) {
            throw e;
        }
    }

    // Fallback: Redirect to verification pending page, preserving redirectTo if present
    const verifyUrl = redirectTo
        ? `/verify-pending?redirectTo=${encodeURIComponent(redirectTo)}`
        : '/verify-pending';

    redirect({href: verifyUrl, locale});
}
