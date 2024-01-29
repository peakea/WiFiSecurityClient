/**
 * Config for OTP
 */
export interface IOtpConfig {
  /**
   * The length of the OTP
   */
  length: number;
  
  /**
   * The time interval for which the OTP is valid
   */
  step: number;
  
  /**
   * The algorithm used to generate the OTP
   */
  hashAlgorithm: string;
  
  /**
   * The secret used to generate the OTP for the password
   */
  passwordSecret: string;
  
  /**
   * The secret used to generate the OTP for the SSID
   */
  ssidSecret: string;
  
  /**
   * The service for which the OTP is generated
   */
  service: string;
  
  /**
   * The OTP issuer
   */
  issuer: string;
}