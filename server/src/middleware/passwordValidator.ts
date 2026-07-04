export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'fair' | 'strong' | 'very_strong';
}

export function validatePassword(password: string): PasswordValidationResult {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (password.length > 128) {
        errors.push('Password must not exceed 128 characters');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    let strength: 'weak' | 'fair' | 'strong' | 'very_strong' = 'weak';
    const passedChecks = 6 - errors.length;

    if (passedChecks >= 6 && password.length >= 12) {
        strength = 'very_strong';
    } else if (passedChecks >= 5 && password.length >= 10) {
        strength = 'strong';
    } else if (passedChecks >= 3) {
        strength = 'fair';
    }

    return {
        isValid: errors.length === 0,
        errors,
        strength,
    };
}

export function generateSecurePassword(): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const all = uppercase + lowercase + numbers + special;

    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    for (let i = 0; i < 8; i++) {
        password += all[Math.floor(Math.random() * all.length)];
    }

    return password
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');
}