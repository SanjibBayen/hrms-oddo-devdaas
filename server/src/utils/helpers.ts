import crypto from 'crypto';

export function generateEmployeeId(): string {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `EMP${num}`;
}

export function generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
}

export function maskEmail(email: string): string {
    const [name, domain] = email.split('@');
    if (!name || !domain) return email;
    return `${name[0]}***@${domain}`;
}

export function maskPhone(phone: string): string {
    if (!phone || phone.length < 4) return phone;
    return `****${phone.slice(-4)}`;
}