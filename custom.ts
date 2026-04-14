/**
 * Blocks for Elvira MandoBit Controller
 */
//% weight=100 color=#3498db icon="\uf11b" block="Elvira Mando"
namespace ElviraMando {

    let currentChannel = 1;

    /**
     * Initializes the Elvira Mando Gamepad connection
     * @param channel The channel number for this robot (1 to 10), eg: 1
     */
    //% block="Start Elvira Mando on Channel $channel"
    //% channel.min=1 channel.max=10 channel.defl=1
    //% weight=100
    export function startMando(channel: number): void {
        currentChannel = channel;

        bluetooth.startUartService();

        bluetooth.onBluetoothConnected(function () {
            basic.showIcon(IconNames.Yes);
            basic.pause(1000);
            bluetooth.uartWriteString("HANDSHAKE:" + currentChannel);
        });

        bluetooth.onBluetoothDisconnected(function () {
            // If disconnected, go back to showing the channel number
            showChannel(currentChannel);
        });

        // Show the channel number on boot
        showChannel(currentChannel);
    }

    // Helper function to display the channel safely without scrolling
    function showChannel(num: number) {
        if (num === 10) {
            // Draw a custom "|0" to prevent scrolling
            let tenImage = images.createImage(`
                # . # # #
                # . # . #
                # . # . #
                # . # . #
                # . # # #
            `);
            tenImage.showImage(0);
        } else {
            // Single digits 1-9 do not scroll natively
            basic.showNumber(num);
        }
    }
}