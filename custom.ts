/**
 * Blocks for Elvira MandoBit Controller
 */
//% weight=100 color=#e74c3c icon="\uf11b" block="MandoBit"
namespace MandoBit {
    // ==========================================================
    // ENUMS (PS2 standard active LOW button masks based on legend)
    // ==========================================================
    // Masks for Byte 3 (user's btn1, indices 6-7 in hex string)
    export enum MandoButton1 {
        //% block="SELECT"
        Select = 1 << 0,
        //% block="L3 (Joy Click)"
        L3 = 1 << 1,
        //% block="R3 (Joy Click)"
        R3 = 1 << 2,
        //% block="START"
        Start = 1 << 3,
        //% block="UP"
        Up = 1 << 4,
        //% block="RIGHT"
        Right = 1 << 5,
        //% block="DOWN"
        Down = 1 << 6,
        //% block="LEFT"
        Left = 1 << 7
    }

    // Masks for Byte 4 (user's btn2, indices 8-9 in hex string)
    export enum MandoButton2 {
        //% block="L2"
        L2 = 1 << 0,
        //% block="R2"
        R2 = 1 << 1,
        //% block="L1"
        L1 = 1 << 2,
        //% block="R1"
        R1 = 1 << 3,
        //% block="Triangle"
        Triangle = 1 << 4,
        //% block="Circle"
        Circle = 1 << 5,
        //% block="Cross"
        Cross = 1 << 6,
        //% block="Square"
        Square = 1 << 7
    }

    // ==========================================================
    // STATE VARIABLES (Namespace internal state)
    // ==========================================================
    // Start with all bits high (not pressed) for buttons, 
    // and neutral (128) for analogs
    let btn1State = 0xFF;
    let btn2State = 0xFF;
    let lJoyX = 0x80;
    let lJoyY = 0x80;
    let rJoyX = 0x80;
    let rJoyY = 0x80;

    let lastRawPacket = "Waiting for data...";
    let lastValidPacketTime = 0; // <--- ADDED FOR WATCHDOG

    // ==========================================================
    // CONNECTION, PARSING, & DATA FILTERING
    // ==========================================================
    /**
     * Initializes the MandoBit connection and starts the UART listener
     * @param channel The channel number for this robot (1 to 10), eg: 1
     */
    //% block="Start MandoBit on Channel $channel"
    //% channel.min=1 channel.max=10 channel.defl=1
    //% weight=100
    export function startMando(channel: number = 1): void {
        bluetooth.startUartService();

        // 1. Send handshake on connect
        bluetooth.onBluetoothConnected(function () {
            basic.showIcon(IconNames.Yes);
            basic.pause(1000);
            bluetooth.uartWriteString("HANDSHAKE:" + channel);
        });

        // 2. Clear state on disconnect
        bluetooth.onBluetoothDisconnected(function () {
            btn1State = 0xFF;
            btn2State = 0xFF;
            // Go back to showing the channel number
            showChannel(channel);
        });

        // 3. Integrated, filtered UART listener (optimized for compressed Hex Strings)
        bluetooth.onUartDataReceived("\n", function () {
            let message = bluetooth.uartReadUntil("\n");

            // ROBUST FILTER: Must be length 18 and start with PS2 sig "FF735A"
            if (message.length == 18 && message.substr(0, 6) == "FF735A") {

                lastValidPacketTime = input.runningTime(); // <--- ADDED: PET THE WATCHDOG

                // Parse and update internal state variables
                btn1State = parseInt("0x" + message.substr(6, 2)); // Byte 3
                btn2State = parseInt("0x" + message.substr(8, 2)); // Byte 4
                rJoyX = parseInt("0x" + message.substr(10, 2));   // Byte 5
                rJoyY = parseInt("0x" + message.substr(12, 2));   // Byte 6
                lJoyX = parseInt("0x" + message.substr(14, 2));   // Byte 7
                lJoyY = parseInt("0x" + message.substr(16, 2));   // Byte 8

                // Format the string with spaces for the monitor
                lastRawPacket = message.substr(0, 2) + " " +
                    message.substr(2, 2) + " " +
                    message.substr(4, 2) + " " +
                    message.substr(6, 2) + " " +
                    message.substr(8, 2) + " " +
                    message.substr(10, 2) + " " +
                    message.substr(12, 2) + " " +
                    message.substr(14, 2) + " " +
                    message.substr(16, 2);
            }
        });

        // Show channel safely (dot for 10)
        showChannel(channel);

        // 4. WATCHDOG FAILSAFE: Runs silently in the background (ADDED)
        control.inBackground(function () {
            while (true) {
                // If 300ms have passed without a valid packet...
                if (input.runningTime() - lastValidPacketTime > 300) {
                    // FORCE IDLE STATE (Brakes!)
                    btn1State = 0xFF;
                    btn2State = 0xFF;
                    lJoyX = 0x80; // 128 (Center)
                    lJoyY = 0x80;
                    rJoyX = 0x80;
                    rJoyY = 0x80;
                    lastRawPacket = "FF 73 5A FF FF 80 80 80 80 (FAILSAFE)";
                }
                basic.pause(50); // Check the dog every 50ms
            }
        });
    }

    function showChannel(num: number) {
        if (num === 10) {
            basic.showLeds(`
                # . # # #
                # . # . #
                # . # . #
                # . # . #
                # . # # #
                `)
        } else {
            basic.showNumber(num);
        }
    }

    // ==========================================================
    // GETTER BLOCKS (Used in logic block programming)
    // ==========================================================
    /**
     * Checks if a button from the first button group (DPAD, SELECT, START) is pressed
     * @param button The specific button to check, eg: MandoButton1.Up
     */
    //% block="MandoBit 1 %button is pressed"
    //% weight=90 blockGap=8
    //% group="Buttons"
    export function isButton1Pressed(button: MandoButton1): boolean {
        // Active LOW logic: return true when bit is 0
        return !(btn1State & button);
    }

    /**
     * Checks if a button from the second button group (TRIGGERS, SHAPES, CROSS/CIRCLE) is pressed
     * @param button The specific button to check, eg: MandoButton2.Triangle
     */
    //% block="MandoBit 2 %button is pressed"
    //% weight=89 blockGap=8
    //% group="Buttons"
    export function isButton2Pressed(button: MandoButton2): boolean {
        // Active LOW logic: return true when bit is 0
        return !(btn2State & button);
    }

    // Add analog getters for completeness, as they are essential
    /**
     * Returns the raw value (0-255) of the Left Analog X axis
     */
    //% block="Left Joy X"
    //% weight=80 blockGap=8
    //% group="Analogs"
    export function getLeftJoyX(): number {
        return lJoyX;
    }

    /**
     * Returns the raw value (0-255) of the Left Analog Y axis
     */
    //% block="Left Joy Y"
    //% weight=79 blockGap=8
    //% group="Analogs"
    export function getLeftJoyY(): number {
        return lJoyY;
    }

    /**
     * Returns the raw value (0-255) of the Right Analog X axis
     */
    //% block="Right Joy X"
    //% weight=78 blockGap=8
    //% group="Analogs"
    export function getRightJoyX(): number {
        return rJoyX;
    }

    /**
     * Returns the raw value (0-255) of the Right Analog Y axis
     */
    //% block="Right Joy Y"
    //% weight=77 blockGap=8
    //% group="Analogs"
    export function getRightJoyY(): number {
        return rJoyY;
    }

    /**
     * Returns the raw hexadecimal packet formatted with spaces
     */
    //% block="Raw Bluetooth Packet"
    //% weight=50 blockGap=8
    //% group="Debug"
    export function getRawPacket(): string {
        return lastRawPacket;
    }
}