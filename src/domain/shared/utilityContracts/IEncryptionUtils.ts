export interface IEncryptionUtils {
    getSalt(rounds: number): string;
    hashPassword(passwd: string, salt: string | number): string;
    comparePassword(passwd: string, hash: string): boolean;
}