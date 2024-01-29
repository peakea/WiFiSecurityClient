/**
 * WiFi code generator using TOTP for use in 
 * dynamic WiFi security applications
 * cutdown version of server side code
 */
import * as crypto from 'crypto';

export class CodeGen {
    constructor(
        public ssidSecret: string = 'SSID',
        public passwordSecret: string = 'Password',
        public service: string = 'WiFi',
        public issuer: string = 'WiFi Generator',
        public step: number = 300,
        public length: number = 10,
        public hashAlgorithm: string = 'sha512'
    ) { }

    /**
     * Get the time within the step interval
     */
    getTime(step: number) {
        return Math.floor(Date.now() / 1000 / step);
    }

    /**
     * Get OTP by combining the secret and the time within the step interval
     * then hashing the result
     */
    getOtp(secret: string, step: number, length: number, hashAlgorithm: string) {
        const time = this.getTime(step);
        const otp = this.HashSeed(secret + time, hashAlgorithm, length);
        return otp;
    }

    /**
     * Generate SSID and Password
     */
    Generate() {
        console.log('generate');
        
        const ssid = this.getOtp(this.ssidSecret, this.step, this.length, this.hashAlgorithm);
        
        const password = this.getOtp(this.passwordSecret, this.step, this.length, this.hashAlgorithm);
        
        const credentials = {
            ssid: ssid,
            password: password
        };
        
        console.log('credentials', credentials);
        
        return credentials;
    }

    /**
     * Use hash algorithm to convert seed to a string of characters
     * of the specified length
     */
    HashSeed(seed: string, hashAlgorithm: string, length: number) {
        const hash = crypto.createHash(hashAlgorithm);
        hash.update(seed.toString());
        const digest = hash.digest('hex');
        return digest.substring(0, length);
    }
}