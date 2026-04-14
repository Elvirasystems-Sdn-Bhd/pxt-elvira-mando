/**
 * Blocks for Elvira MandoBit Controller
 */
//% weight=100 color=#3498db icon="\uf11b" block="Elvira Mando"
namespace ElviraMando {

    // An internal variable to remember what channel this micro:bit is on
    let currentChannel = 1;

    /**
     * Initializes the Elvira Mando Gamepad connection
     * @param channel The channel number for this robot (1 to 10), eg: 1
     */
    //% block="Start Elvira Mando on Channel $channel"
    //% channel.min=1 channel.max=10 channel.defl=1
    //% weight=100
    export function startMando(channel: number): void {
        // 1. Save the student's chosen channel
        currentChannel = channel;

        // 2. Start the Bluetooth UART service (allows sending/receiving text)
        bluetooth.startUartService();

        // 3. Set up the Handshake event! 
        bluetooth.onBluetoothConnected(function () {
            // Show a checkmark so we visually know the connection started
            basic.showIcon(IconNames.Yes);

            // CRITICAL FIX: Wait 1 second for the web app to finish setting up its listeners
            basic.pause(1000);

            // Now that the web app is definitely listening, send the handshake!
            bluetooth.uartWriteString("HANDSHAKE:" + currentChannel);
        });

        // 4. Set up a Disconnect event
        bluetooth.onBluetoothDisconnected(function () {
            // Show an 'X' if the phone disconnects
            basic.showIcon(IconNames.No);
        });

        // Show a hollow square on boot so the student knows it is waiting to pair
        basic.showIcon(IconNames.Square);
    }
}