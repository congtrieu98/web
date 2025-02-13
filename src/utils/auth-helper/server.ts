'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getErrorRedirect, getStatusRedirect, getURL } from '../helpers';
import { getAuthTypes } from './settings';

function isValidEmail(email: string) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

export async function redirectToPath(path: string) {
  return redirect(path);
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return getErrorRedirect(
      '/',
      'Hmm... Something went wrong.',
      'You could not be signed out.',
    );
  }

  return '/dashboard/auth';
}

export async function signInWithEmail(formData: FormData) {
  const cookieStore = cookies();
  const callbackURL = getURL('/auth/callback');

  const email = String(formData.get('email')).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    return getErrorRedirect(
      '/dashboard/auth',
      'Invalid email address.',
      'Please try again.',
    );
  }

  const supabase = await createClient();
  const options = {
    emailRedirectTo: callbackURL,
    shouldCreateUser: true,
  };

  // If allowPassword is false, do not create a new user
  const { allowPassword } = getAuthTypes();
  if (allowPassword) options.shouldCreateUser = false;
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: options,
  });

  console.log('Sign in with otp, data', data);

  if (error) {
    redirectPath = getErrorRedirect(
      '/dashboard/auth',
      'You could not be signed in.',
      error.message,
    );
  } else if (data) {
    (await cookieStore).set('preferredSignInView', 'email_signin', {
      path: '/',
    });
    redirectPath = getStatusRedirect(
      '/dashboard/auth',
      'Success!',
      'Please check your email for a magic link. You may now close this tab.',
      true,
    );
  } else {
    redirectPath = getErrorRedirect(
      '/dashboard/auth',
      'Hmm... Something went wrong.',
      'You could not be signed in.',
    );
  }

  return redirectPath;
}

export async function requestPasswordUpdate(formData: FormData) {
  const callbackURL = getURL('/auth/reset_password');

  const email = String(formData.get('email')).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    return getErrorRedirect(
      '/forgot_password',
      'Invalid email address.',
      'Please try again.',
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackURL,
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/forgot_password',
      error.message,
      'Please try again.',
    );
  } else if (data) {
    redirectPath = getStatusRedirect(
      '/forgot_password',
      'Success!',
      'Please check your email for a password reset link. You may now close this tab.',
      true,
    );
  } else {
    redirectPath = getErrorRedirect(
      '/forgot_password',
      'Hmm... Something went wrong.',
      'Password reset email could not be sent.',
    );
  }

  return redirectPath;
}

export async function signInWithPassword(formData: FormData) {
  const cookieStore = cookies();
  const email = String(formData.get('email')).trim();
  const password = String(formData.get('password')).trim();
  let redirectPath: string;

  const supabase = await createClient();
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/dashboard/auth',
      'Sign in failed.',
      error.message,
    );
  } else if (data.user) {
    (await cookieStore).set('preferredSignInView', 'password_signin', {
      path: '/',
    });
    redirectPath = getStatusRedirect('/', 'Success!', 'You are now signed in.');
  } else {
    redirectPath = getErrorRedirect(
      '/dashboard/auth',
      'Hmm... Something went wrong.',
      'You could not be signed in.',
    );
  }

  return redirectPath;
}

export async function signUp(formData: FormData) {
  const callbackURL = getURL('/auth/callback');

  const email = String(formData.get('email')).trim();
  const password = String(formData.get('password')).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    return getErrorRedirect(
      '/signup',
      'Invalid email address.',
      'Please try again.',
    );
  }

  const supabase = await createClient();
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackURL,
    },
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/signup',
      'Sign up failed.',
      error.message,
    );
  } else if (data.session) {
    redirectPath = getStatusRedirect('/', 'Success!', 'You are now signed in.');
  } else if (
    data.user &&
    data.user.identities &&
    data.user.identities.length == 0
  ) {
    redirectPath = getErrorRedirect(
      '/signup',
      'Sign up failed.',
      'There is already an account associated with this email address. Try resetting your password.',
    );
  } else if (data.user) {
    redirectPath = getStatusRedirect(
      '/',
      'Success!',
      'Please check your email for a confirmation link. You may now close this tab.',
    );
  } else {
    redirectPath = getErrorRedirect(
      '/signup',
      'Hmm... Something went wrong.',
      'You could not be signed up.',
    );
  }

  return redirectPath;
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get('password')).trim();
  const passwordConfirm = String(formData.get('passwordConfirm')).trim();
  let redirectPath: string;

  if (password !== passwordConfirm) {
    return getErrorRedirect(
      '/update_password',
      'Your password could not be updated.',
      'Passwords do not match.',
    );
  }

  const supabase = await createClient();
  const { error, data } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/update_password',
      'Your password could not be updated.',
      error.message,
    );
  } else if (data.user) {
    redirectPath = getStatusRedirect(
      '/',
      'Success!',
      'Your password has been updated.',
    );
  } else {
    redirectPath = getErrorRedirect(
      '/update_password',
      'Hmm... Something went wrong.',
      'Your password could not be updated.',
    );
  }

  return redirectPath;
}

export async function updateEmail(formData: FormData) {
  const newEmail = String(formData.get('newEmail')).trim();

  if (!isValidEmail(newEmail)) {
    return getErrorRedirect(
      '/dashboard/account',
      'Your email could not be updated.',
      'Invalid email address.',
    );
  }

  const supabase = await createClient();

  const callbackUrl = getURL(
    getStatusRedirect(
      '/dashboard/account',
      'Success!',
      `Your email has been updated.`,
    ),
  );

  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    {
      emailRedirectTo: callbackUrl,
    },
  );

  if (error) {
    return getErrorRedirect(
      '/dashboard/account',
      'Your email could not be updated.',
      error.message,
    );
  } else {
    return getStatusRedirect(
      '/dashboard/account',
      'Confirmation emails sent.',
      `You will need to confirm the update by clicking the links sent to both the old and new email addresses.`,
    );
  }
}

export async function updateName(formData: FormData) {
  const fullName = String(formData.get('fullName')).trim();

  const supabase = await createClient();
  const { error, data } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  if (error) {
    return getErrorRedirect(
      '/dashboard/account',
      'Your name could not be updated.',
      error.message,
    );
  } else if (data.user) {
    return getStatusRedirect(
      '/dashboard/account',
      'Success!',
      'Your name has been updated.',
    );
  } else {
    return getErrorRedirect(
      '/dashboard/account',
      'Hmm... Something went wrong.',
      'Your name could not be updated.',
    );
  }
}
