import { CodeGen } from "./code_gen";
import { IClientConfig } from "./interfaces/i_client_config";
import { IWifiCredentials } from "./interfaces/i_wifi_credentials";
import { exec } from 'child_process';

/**
 * Wifi Security Client
 */

/**
 * Configuration
 */
const config:IClientConfig = require('./config.json');

/**
 * SSID/Password code generator
 */
const codeGen = new CodeGen(
    config.otp.ssidSecret,
    config.otp.passwordSecret,
    config.otp.service,
    config.otp.issuer,
    config.otp.step,
    config.otp.length,
    config.otp.hashAlgorithm
);

/**
 * The last time the OTP was updated
 * this is time in seconds since epoch divided by the step
 */
let lastTime = 0;

/**
 * Generate a new username and password and set the router to use them
 */
function Update() {
    const time = codeGen.getTime(config.otp.step);
    console.log('OTP Update', time);
    // Only update if the time has changed
    if (time > lastTime) {
        lastTime = time;
        const credentials = codeGen.Generate();
        // Update wifi credentials
        UpdateWiFi(credentials);
    }
}

/**
 * Update the WiFi credentials
 */
function UpdateWiFi(credentials: IWifiCredentials) {
    switch (config.os) {
        case 'linux':
            UpdateLinux(credentials);
            break;
        case 'windows':
            UpdateWindows(credentials);
            break;
        case 'macos':
            UpdateMacOS(credentials);
            break;
        default:
            throw new Error(`Unsupported OS: ${config.os}`);
    }
}

/**
 * Update the WiFi credentials on a Mac
 */
function UpdateMacOS(credentials: IWifiCredentials) {
    console.log('Update MAC OS WiFi');
    // Create hotspot using the given ssid and password on terminal
    exec(`networksetup -setairportnetwork ${config.interfaceName} ${credentials.ssid} ${credentials.password}`, (err, stdout, stderr) => {
        if (err) {
            // node couldn't execute the command
            console.log('error', err);
            return;
        }
        // Check the network is set incase we are faster than the hotspot
        if (stdout.startsWith('Could not find network')) {
            console.log('Could not find network, trying again');
            // Update again next time
            lastTime = 0;
        } 
    }
    );
}

/**
 * Update the WiFi credentials on Windows
 */
function UpdateWindows(credentials: IWifiCredentials) {
    throw new Error("Method not implemented.");
}

/**
 * Update the WiFi credentials on Linux
 */
function UpdateLinux(credential: IWifiCredentials) {
    throw new Error("Method not implemented.");
}

/**
 *  Call update every n minutes
 * 
 * @param {number} setInterval how often to call update in milliseconds
 */
function Start(interval: number) {
    console.log('start');
    Update();
    // Update every n milliseconds
    setInterval(Update, interval);
}

// Start the client
Start(config.interval);