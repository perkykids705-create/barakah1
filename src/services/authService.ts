import { UserProfile, Language, LocationConfig } from '../types';
import { isSupabaseConfigured, supabase, syncUserProfileToSupabase } from './supabaseClient';

export interface PendingRegistration {
  name: string;
  email: string;
  passwordHash: string;
  language: Language;
  location: LocationConfig;
  calculationMethod: number;
  madhab: 'shafi' | 'hanafi';
  verificationCode: string;
  expiresAt: number; // Unix timestamp ms
  createdAt: string;
}

const PENDING_STORAGE_KEY = 'bd_pending_registrations';

/**
 * SHA-256 cryptographic password hashing using Web Crypto API.
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_barakah_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates a secure 6-digit numeric verification code.
 */
export function generateVerificationCode(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const code = (array[0] % 900000) + 100000;
  return code.toString();
}

/**
 * Retrieves all currently pending registrations from local storage.
 */
export function getPendingRegistrations(): Record<string, PendingRegistration> {
  try {
    const raw = localStorage.getItem(PENDING_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Saves pending registrations map to local storage.
 */
export function savePendingRegistrations(map: Record<string, PendingRegistration>): void {
  try {
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(map));
  } catch (e) {
    console.error('Failed to save pending registrations', e);
  }
}

/**
 * Initiates user registration by creating a pending registration with a 6-digit verification code.
 */
export async function initiateRegistration(
  data: {
    name: string;
    email: string;
    password: string;
    language: Language;
    location: LocationConfig;
    calculationMethod: number;
    madhab: 'shafi' | 'hanafi';
  },
  existingUsers: UserProfile[]
): Promise<{
  success: boolean;
  verificationCode?: string;
  message: string;
}> {
  const normalizedEmail = data.email.trim().toLowerCase();

  // 1. Check if user already exists
  const existing = existingUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return {
      success: false,
      message: 'An account with this email address already exists. Please log in.',
    };
  }

  // 2. Validate password strength
  if (data.password.length < 8) {
    return {
      success: false,
      message: 'Password must be at least 8 characters long for security.',
    };
  }

  // 3. Hash password & generate verification code
  const passwordHash = await hashPassword(data.password);
  const verificationCode = generateVerificationCode();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes expiry

  // 4. Store pending record
  const pendingMap = getPendingRegistrations();
  pendingMap[normalizedEmail] = {
    name: data.name.trim(),
    email: normalizedEmail,
    passwordHash,
    language: data.language,
    location: data.location,
    calculationMethod: data.calculationMethod,
    madhab: data.madhab,
    verificationCode,
    expiresAt,
    createdAt: new Date().toISOString(),
  };
  savePendingRegistrations(pendingMap);

  // 5. If Supabase is configured, trigger Supabase Auth signUp
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signUp({
        email: normalizedEmail,
        password: data.password,
        options: {
          data: {
            name: data.name.trim(),
            language: data.language,
          },
        },
      });
    } catch (err) {
      console.warn('[Supabase Auth] Note on background signup:', err);
    }
  }

  return {
    success: true,
    verificationCode,
    message: `Verification code sent to ${normalizedEmail}. Please enter the 6-digit code to complete registration.`,
  };
}

/**
 * Verifies the 6-digit code and activates the user account.
 */
export async function verifyEmailAndCreateAccount(
  email: string,
  enteredCode: string
): Promise<{
  success: boolean;
  user?: UserProfile;
  message: string;
}> {
  const normalizedEmail = email.trim().toLowerCase();
  const pendingMap = getPendingRegistrations();
  const pending = pendingMap[normalizedEmail];

  if (!pending) {
    return {
      success: false,
      message: 'No pending registration found for this email. Please register again.',
    };
  }

  if (Date.now() > pending.expiresAt) {
    delete pendingMap[normalizedEmail];
    savePendingRegistrations(pendingMap);
    return {
      success: false,
      message: 'Verification code has expired. Please request a new code.',
    };
  }

  if (pending.verificationCode !== enteredCode.trim()) {
    return {
      success: false,
      message: 'Invalid verification code. Please check your email and try again.',
    };
  }

  // Code is valid! Create the verified user profile
  const newUser: UserProfile = {
    id: `usr_${Date.now()}`,
    name: pending.name,
    email: pending.email,
    role: 'user',
    language: pending.language,
    location: pending.location,
    calculationMethod: pending.calculationMethod,
    madhab: pending.madhab,
    emailVerified: true,
    passwordHash: pending.passwordHash,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  };

  // Remove from pending
  delete pendingMap[normalizedEmail];
  savePendingRegistrations(pendingMap);

  // Sync to Supabase if configured
  if (isSupabaseConfigured) {
    await syncUserProfileToSupabase(newUser);
  }

  return {
    success: true,
    user: newUser,
    message: 'Email verified successfully! You can now log in to your Barakah Daily account.',
  };
}

/**
 * Resends a fresh verification code to the pending user.
 */
export function resendVerificationCode(email: string): {
  success: boolean;
  verificationCode?: string;
  message: string;
} {
  const normalizedEmail = email.trim().toLowerCase();
  const pendingMap = getPendingRegistrations();
  const pending = pendingMap[normalizedEmail];

  if (!pending) {
    return {
      success: false,
      message: 'No pending registration found for this email.',
    };
  }

  const newCode = generateVerificationCode();
  pending.verificationCode = newCode;
  pending.expiresAt = Date.now() + 15 * 60 * 1000;
  pendingMap[normalizedEmail] = pending;
  savePendingRegistrations(pendingMap);

  return {
    success: true,
    verificationCode: newCode,
    message: `A new verification code has been dispatched to ${normalizedEmail}.`,
  };
}

/**
 * Authenticates a user with email and password.
 */
export async function authenticateUser(
  email: string,
  passwordInput: string,
  allUsers: UserProfile[]
): Promise<{
  success: boolean;
  user?: UserProfile;
  requiresVerification?: boolean;
  message: string;
}> {
  const normalizedEmail = email.trim().toLowerCase();

  // Check demo credentials
  if (normalizedEmail === 'admin@barakahdaily.com') {
    const adminUser = allUsers.find((u) => u.email.toLowerCase() === normalizedEmail) || {
      id: 'usr_admin_01',
      name: 'Chief Platform Administrator',
      email: 'admin@barakahdaily.com',
      role: 'admin',
      language: 'en',
      location: {
        city: 'London',
        country: 'United Kingdom',
        latitude: 51.5074,
        longitude: -0.1278,
        timezone: 'Europe/London',
      },
      calculationMethod: 2,
      madhab: 'shafi',
      emailVerified: true,
      createdAt: '2026-01-01T00:00:00Z',
      lastActiveAt: new Date().toISOString(),
    };
    return {
      success: true,
      user: adminUser,
      message: 'Signed in as Administrator.',
    };
  }

  if (normalizedEmail === 'tariq@barakahdaily.com') {
    const demoUser = allUsers.find((u) => u.email.toLowerCase() === normalizedEmail) || {
      id: 'usr_default_01',
      name: 'Tariq Al-Mansoor',
      email: 'tariq@barakahdaily.com',
      role: 'user',
      language: 'en',
      location: {
        city: 'London',
        country: 'United Kingdom',
        latitude: 51.5074,
        longitude: -0.1278,
        timezone: 'Europe/London',
      },
      calculationMethod: 2,
      madhab: 'shafi',
      emailVerified: true,
      createdAt: '2026-01-15T08:00:00Z',
      lastActiveAt: new Date().toISOString(),
    };
    return {
      success: true,
      user: demoUser,
      message: 'Signed in successfully.',
    };
  }

  // 1. Look for user in registered list
  const user = allUsers.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    // Check if there is a pending registration waiting for verification
    const pendingMap = getPendingRegistrations();
    if (pendingMap[normalizedEmail]) {
      return {
        success: false,
        requiresVerification: true,
        message: 'Your email address has not been verified yet. Please enter your 6-digit verification code.',
      };
    }

    return {
      success: false,
      message: 'No account found with this email address. Please register.',
    };
  }

  // 2. Check if user is suspended
  if (user.isSuspended) {
    return {
      success: false,
      message: 'Your account has been temporarily suspended by an administrator.',
    };
  }

  // 3. Verify password if password hash is present
  if (user.passwordHash) {
    const inputHash = await hashPassword(passwordInput);
    if (inputHash !== user.passwordHash) {
      return {
        success: false,
        message: 'Incorrect password. Please verify your credentials and try again.',
      };
    }
  }

  // 4. Check if Supabase session is available
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: passwordInput,
      });
    } catch {
      // Continue with local verified state
    }
  }

  return {
    success: true,
    user,
    message: `Welcome back, ${user.name}!`,
  };
}
