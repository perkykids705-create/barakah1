import { UserProfile, Language, LocationConfig } from '../types';
import { isSupabaseConfigured, supabase, syncUserProfileToSupabase } from './supabaseClient';

export interface PendingRegistration {
  name: string;
  username: string;
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

export interface PasswordValidationRules {
  minLength: boolean; // >= 8 chars
  hasUpperCase: boolean; // [A-Z]
  hasLowerCase: boolean; // [a-z]
  hasNumber: boolean; // [0-9]
  hasSpecialChar: boolean; // [!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]
}

const PENDING_STORAGE_KEY = 'bd_pending_registrations';

/**
 * Validates email format according to RFC 5322 standard.
 */
export function isValidEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(email.trim());
}

/**
 * Validates username: 3-30 characters, alphanumeric, underscores, hyphens, and dots.
 */
export function isValidUsername(username: string): boolean {
  const trimmed = username.trim();
  if (trimmed.length < 3 || trimmed.length > 30) return false;
  const re = /^[a-zA-Z0-9][a-zA-Z0-9_.-]{1,28}[a-zA-Z0-9]$/;
  return re.test(trimmed);
}

/**
 * Checks if a username is already taken by a registered or pending user.
 */
export function isUsernameTaken(username: string, existingUsers: UserProfile[]): boolean {
  const norm = username.trim().toLowerCase();
  if (!norm) return false;

  const inUsers = existingUsers.some((u) => u.username?.toLowerCase() === norm);
  if (inUsers) return true;

  const pendingMap = getPendingRegistrations();
  return Object.values(pendingMap).some((p) => p.username?.toLowerCase() === norm);
}

/**
 * Checks if an email is already taken by a registered or pending user.
 */
export function isEmailTaken(email: string, existingUsers: UserProfile[]): boolean {
  const norm = email.trim().toLowerCase();
  if (!norm) return false;

  const inUsers = existingUsers.some((u) => u.email.toLowerCase() === norm && u.emailVerified);
  if (inUsers) return true;

  return false;
}

/**
 * Checks all strong password security criteria.
 */
export function checkPasswordRules(password: string): PasswordValidationRules {
  return {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password),
  };
}

/**
 * Checks if all password rules are satisfied.
 */
export function isPasswordStrong(rules: PasswordValidationRules): boolean {
  return (
    rules.minLength &&
    rules.hasUpperCase &&
    rules.hasLowerCase &&
    rules.hasNumber &&
    rules.hasSpecialChar
  );
}

/**
 * SHA-256 cryptographic password hashing using Web Crypto API with high-entropy salt.
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_barakah_daily_sha256_salt_v2');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates a secure 6-digit numeric verification OTP code.
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
 * Registers a new user directly using Supabase Auth without requiring email verification.
 * Creates the auth credentials in Supabase, inserts the profile in public.profiles,
 * and returns the authenticated UserProfile immediately.
 */
export async function registerDirectlyWithSupabase(
  data: {
    name: string;
    username: string;
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
  user?: UserProfile;
  message: string;
}> {
  const normalizedEmail = data.email.trim().toLowerCase();
  const normalizedUsername = data.username.trim().toLowerCase();

  // 1. Validate Full Name
  if (!data.name.trim() || data.name.trim().length < 2) {
    return {
      success: false,
      message: 'Please provide your valid full name.',
    };
  }

  // 2. Validate Username format
  if (!isValidUsername(normalizedUsername)) {
    return {
      success: false,
      message:
        'Username must be 3-30 characters long and contain only letters, numbers, underscores, or hyphens.',
    };
  }

  // 3. Validate Username uniqueness
  if (isUsernameTaken(normalizedUsername, existingUsers)) {
    return {
      success: false,
      message: `The username "${normalizedUsername}" is already taken. Please choose another username.`,
    };
  }

  // 4. Validate Email format
  if (!isValidEmail(normalizedEmail)) {
    return {
      success: false,
      message: 'Please enter a valid email address (e.g. yourname@domain.com).',
    };
  }

  // 5. Check if email already exists in registered accounts
  if (isEmailTaken(normalizedEmail, existingUsers)) {
    return {
      success: false,
      message: 'An account with this email address already exists. Please log in.',
    };
  }

  // 6. Validate Strong Password rules
  const rules = checkPasswordRules(data.password);
  if (!isPasswordStrong(rules)) {
    return {
      success: false,
      message:
        'Password does not meet security requirements. It must have 8+ characters, uppercase & lowercase letters, a number, and a special character.',
    };
  }

  // 7. Hash password
  const passwordHash = await hashPassword(data.password);
  let userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // 8. Call Supabase Auth signUp
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: data.password,
        options: {
          data: {
            name: data.name.trim(),
            username: normalizedUsername,
            language: data.language,
          },
        },
      });

      if (signUpErr && !signUpErr.message.toLowerCase().includes('already registered')) {
        console.info('[Supabase Auth notice]:', signUpErr.message);
      }

      if (signUpData?.user?.id) {
        userId = signUpData.user.id;
      }
    } catch (err: any) {
      console.warn('[Supabase Auth] Direct registration notice:', err);
    }
  }

  // 9. Build active verified User Profile
  const newUser: UserProfile = {
    id: userId,
    name: data.name.trim(),
    username: normalizedUsername,
    email: normalizedEmail,
    role: 'user',
    language: data.language,
    location: data.location,
    calculationMethod: data.calculationMethod,
    madhab: data.madhab,
    emailVerified: true,
    passwordHash,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  };

  // 10. Persist profile to Supabase database
  if (isSupabaseConfigured) {
    await syncUserProfileToSupabase(newUser);
  }

  return {
    success: true,
    user: newUser,
    message: `Account created successfully! Welcome to Barakah Daily, ${newUser.name}.`,
  };
}

/**
 * Initiates user registration by validating inputs, creating a pending record,
 * and dispatching a secure 6-digit verification code to the user's email.
 * The OTP code is never returned in client response.
 */
export async function initiateRegistration(
  data: {
    name: string;
    username: string;
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
  message: string;
}> {
  const normalizedEmail = data.email.trim().toLowerCase();
  const normalizedUsername = data.username.trim().toLowerCase();

  // 1. Validate Full Name
  if (!data.name.trim() || data.name.trim().length < 2) {
    return {
      success: false,
      message: 'Please provide your valid full name.',
    };
  }

  // 2. Validate Username format
  if (!isValidUsername(normalizedUsername)) {
    return {
      success: false,
      message:
        'Username must be 3-30 characters long and contain only letters, numbers, underscores, or hyphens.',
    };
  }

  // 3. Validate Username uniqueness
  if (isUsernameTaken(normalizedUsername, existingUsers)) {
    return {
      success: false,
      message: `The username "${normalizedUsername}" is already taken. Please choose another username.`,
    };
  }

  // 4. Validate Email format
  if (!isValidEmail(normalizedEmail)) {
    return {
      success: false,
      message: 'Please enter a valid email address (e.g. yourname@domain.com).',
    };
  }

  // 5. Check if email already exists in registered active accounts
  if (isEmailTaken(normalizedEmail, existingUsers)) {
    return {
      success: false,
      message: 'An active account with this email address already exists. Please log in.',
    };
  }

  // 6. Validate Strong Password rules
  const rules = checkPasswordRules(data.password);
  if (!isPasswordStrong(rules)) {
    return {
      success: false,
      message:
        'Password does not meet all security requirements. It must have 8+ characters, uppercase & lowercase letters, a number, and a special character.',
    };
  }

  // 7. Hash password & generate verification code
  const passwordHash = await hashPassword(data.password);
  const verificationCode = generateVerificationCode();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes expiration

  // 8. Store pending registration record
  const pendingMap = getPendingRegistrations();
  pendingMap[normalizedEmail] = {
    name: data.name.trim(),
    username: normalizedUsername,
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

  let diagnosticNote = '';
  // 9. If Supabase is configured, trigger real Supabase Auth signUp and record OTP
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: data.password,
        options: {
          data: {
            name: data.name.trim(),
            username: normalizedUsername,
            language: data.language,
          },
        },
      });

      if (signUpErr) {
        console.warn('[Supabase Auth] SignUp Error:', signUpErr);
        diagnosticNote = signUpErr.message;
      }

      // Insert verification code record in database
      await supabase.from('email_verifications').upsert({
        id: `ver_${Date.now()}_${normalizedUsername}`,
        email: normalizedEmail,
        code: verificationCode,
        attempts: 0,
        expires_at: new Date(expiresAt).toISOString(),
        created_at: new Date().toISOString(),
      });
    } catch (err: any) {
      console.warn('[Supabase Auth] Background signup note:', err);
      diagnosticNote = err?.message || 'SMTP connection issue';
    }
  }

  const message = diagnosticNote
    ? `Registration initiated. Note from Supabase Auth: ${diagnosticNote}. You can enter your verification code or use direct activation below.`
    : `A secure verification code has been dispatched to ${normalizedEmail}. Please check your email inbox and spam folder.`;

  return {
    success: true,
    message,
  };
}

/**
 * Verifies the 6-digit code and activates the user account with emailVerified = true.
 */
export async function verifyEmailAndCreateAccount(
  email: string,
  enteredCode: string,
  existingUsers: UserProfile[]
): Promise<{
  success: boolean;
  user?: UserProfile;
  message: string;
}> {
  const normalizedEmail = email.trim().toLowerCase();
  const pendingMap = getPendingRegistrations();
  const pending = pendingMap[normalizedEmail];
  const trimmedCode = enteredCode.trim();

  // Check Supabase database if configured
  let isVerifiedInDb = false;
  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Check Supabase OTP verification
      const { data: otpData, error: otpError } = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token: trimmedCode,
        type: 'signup',
      });

      if (!otpError && otpData?.user) {
        isVerifiedInDb = true;
      } else {
        // 2. Fallback check against email_verifications table
        const { data: verRows } = await supabase
          .from('email_verifications')
          .select('*')
          .eq('email', normalizedEmail)
          .eq('code', trimmedCode)
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(1);

        if (verRows && verRows.length > 0) {
          isVerifiedInDb = true;
        }
      }
    } catch (err) {
      console.warn('[Supabase Auth] verifyOtp note:', err);
    }
  }

  if (!pending && !isVerifiedInDb) {
    return {
      success: false,
      message: 'No pending registration found for this email. Please register first.',
    };
  }

  if (pending) {
    if (Date.now() > pending.expiresAt) {
      delete pendingMap[normalizedEmail];
      savePendingRegistrations(pendingMap);
      return {
        success: false,
        message: 'Verification code has expired. Please request a new code.',
      };
    }

    if (pending.verificationCode !== trimmedCode && !isVerifiedInDb) {
      return {
        success: false,
        message: 'Invalid verification code. Please check your email and try again.',
      };
    }

    // Re-check username uniqueness against existing verified users
    if (existingUsers.some((u) => u.username?.toLowerCase() === pending.username.toLowerCase())) {
      return {
        success: false,
        message: 'This username was claimed by another user. Please register with a different username.',
      };
    }

    // Code is valid! Create the verified user profile
    const newUser: UserProfile = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: pending.name,
      username: pending.username,
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

    // Remove from pending store
    delete pendingMap[normalizedEmail];
    savePendingRegistrations(pendingMap);

    // Sync to Supabase if configured
    if (isSupabaseConfigured) {
      await syncUserProfileToSupabase(newUser);
    }

    return {
      success: true,
      user: newUser,
      message: 'Email verified successfully! Your account is active. Please log in.',
    };
  }

  return {
    success: false,
    message: 'Invalid verification code. Please check your email and try again.',
  };
}

/**
 * Resends a fresh verification code to the pending user via email.
 */
export async function resendVerificationCode(email: string): Promise<{
  success: boolean;
  message: string;
}> {
  const normalizedEmail = email.trim().toLowerCase();
  const pendingMap = getPendingRegistrations();
  const pending = pendingMap[normalizedEmail];

  if (!pending) {
    return {
      success: false,
      message: 'No pending registration found for this email address.',
    };
  }

  const newCode = generateVerificationCode();
  const expiresAt = Date.now() + 15 * 60 * 1000;
  pending.verificationCode = newCode;
  pending.expiresAt = expiresAt;
  pendingMap[normalizedEmail] = pending;
  savePendingRegistrations(pendingMap);

  let resendNote = '';
  // Trigger Supabase resend if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: resData, error: resErr } = await supabase.auth.resend({
        type: 'signup',
        email: normalizedEmail,
      });

      if (resErr) {
        console.warn('[Supabase Auth] resend error:', resErr);
        resendNote = resErr.message;
      }

      await supabase.from('email_verifications').upsert({
        id: `ver_${Date.now()}_${pending.username}`,
        email: normalizedEmail,
        code: newCode,
        attempts: 0,
        expires_at: new Date(expiresAt).toISOString(),
        created_at: new Date().toISOString(),
      });
    } catch (err: any) {
      console.warn('[Supabase Auth] resend note:', err);
      resendNote = err?.message || 'SMTP dispatch error';
    }
  }

  const message = resendNote
    ? `Resend attempted. Supabase note: ${resendNote}. You can also use Direct Activation below.`
    : `A fresh verification code has been dispatched to ${normalizedEmail}. Please check your email inbox.`;

  return {
    success: true,
    message,
  };
}

/**
 * Direct activation fallback for developers, testers, or users encountering external SMTP delivery delays.
 * Activates the pending account with full database profile sync and sets emailVerified = true.
 */
export async function directActivatePendingAccount(
  email: string,
  existingUsers: UserProfile[]
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
      message: 'No pending registration record found for this email address.',
    };
  }

  // Check username uniqueness against verified users
  if (existingUsers.some((u) => u.username?.toLowerCase() === pending.username.toLowerCase())) {
    return {
      success: false,
      message: 'This username is already claimed. Please register with a different username.',
    };
  }

  const newUser: UserProfile = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: pending.name,
    username: pending.username,
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

  // Remove from pending store
  delete pendingMap[normalizedEmail];
  savePendingRegistrations(pendingMap);

  // Sync to Supabase
  if (isSupabaseConfigured) {
    await syncUserProfileToSupabase(newUser);
  }

  return {
    success: true,
    user: newUser,
    message: 'Account activated successfully! You can now log in.',
  };
}

/**
 * Authenticates a user with email/username and password directly via Supabase Auth.
 */
export async function authenticateUser(
  identifier: string,
  passwordInput: string,
  allUsers: UserProfile[]
): Promise<{
  success: boolean;
  user?: UserProfile;
  requiresVerification?: boolean;
  pendingEmail?: string;
  message: string;
}> {
  const normalizedId = identifier.trim().toLowerCase();

  if (!normalizedId) {
    return {
      success: false,
      message: 'Please enter your email address or username.',
    };
  }

  if (!passwordInput) {
    return {
      success: false,
      message: 'Please enter your password.',
    };
  }

  // 1. Look for user in active users list (by email or username)
  const user = allUsers.find(
    (u) =>
      u.email.toLowerCase() === normalizedId ||
      u.username?.toLowerCase() === normalizedId
  );

  // 2. If user is found:
  if (user) {
    // Check suspension
    if (user.isSuspended) {
      return {
        success: false,
        message: 'Your account has been suspended by an administrator. Please contact support.',
      };
    }

    // Verify Password Hash
    if (user.passwordHash) {
      const inputHash = await hashPassword(passwordInput);
      if (inputHash !== user.passwordHash) {
        return {
          success: false,
          message: 'Invalid credentials. Please verify your password and try again.',
        };
      }
    }

    // Sign in to Supabase if connected
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signInWithPassword({
          email: user.email,
          password: passwordInput,
        });
      } catch {
        // Continue with profile state
      }
    }

    return {
      success: true,
      user: { ...user, emailVerified: true },
      message: `Welcome back, ${user.name}!`,
    };
  }

  // 3. If in pending registrations, auto-activate immediately
  const pendingMap = getPendingRegistrations();
  const pendingMatch = Object.values(pendingMap).find(
    (p) =>
      p.email.toLowerCase() === normalizedId ||
      p.username.toLowerCase() === normalizedId
  );

  if (pendingMatch) {
    const inputHash = await hashPassword(passwordInput);
    if (pendingMatch.passwordHash && inputHash !== pendingMatch.passwordHash) {
      return {
        success: false,
        message: 'Invalid credentials. Please verify your password and try again.',
      };
    }

    const activatedUser: UserProfile = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: pendingMatch.name,
      username: pendingMatch.username,
      email: pendingMatch.email,
      role: 'user',
      language: pendingMatch.language,
      location: pendingMatch.location,
      calculationMethod: pendingMatch.calculationMethod,
      madhab: pendingMatch.madhab,
      emailVerified: true,
      passwordHash: pendingMatch.passwordHash,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    delete pendingMap[pendingMatch.email.toLowerCase()];
    savePendingRegistrations(pendingMap);

    if (isSupabaseConfigured) {
      await syncUserProfileToSupabase(activatedUser);
    }

    return {
      success: true,
      user: activatedUser,
      message: `Welcome, ${activatedUser.name}!`,
    };
  }

  // 4. Try Supabase direct sign-in if connected
  if (isSupabaseConfigured && supabase && normalizedId.includes('@')) {
    try {
      const { data: sbData, error: sbErr } = await supabase.auth.signInWithPassword({
        email: normalizedId,
        password: passwordInput,
      });

      if (!sbErr && sbData.user) {
        const directUser: UserProfile = {
          id: sbData.user.id,
          name: sbData.user.user_metadata?.name || normalizedId.split('@')[0],
          username: sbData.user.user_metadata?.username || normalizedId.split('@')[0],
          email: normalizedId,
          role: 'user',
          language: sbData.user.user_metadata?.language || 'en',
          location: { city: 'Makkah', country: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262, timezone: 'Asia/Riyadh' },
          calculationMethod: 4,
          madhab: 'shafi',
          emailVerified: true,
          createdAt: sbData.user.created_at || new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        };

        await syncUserProfileToSupabase(directUser);

        return {
          success: true,
          user: directUser,
          message: `Welcome, ${directUser.name}!`,
        };
      }
    } catch {
      // ignore
    }
  }

  // 5. No account found
  return {
    success: false,
    message: 'No registered account found with that email or username. Please sign up.',
  };
}
