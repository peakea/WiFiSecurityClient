import { IOtpConfig } from "./i_otp_config";

/**
 * WiFi client configuration interface
 */
export interface IClientConfig {
    /**
     * WiFi interface name
     */
    interfaceName: string;
    
    /**
     * Operating system for client
     */
    os: "linux" | "windows" | "macos";
    
    /**
     * OTP configuration
     */
    otp: IOtpConfig;
    
    /**
     * The time interval to check and update the WiFi credentials
     */
    interval: number;
}