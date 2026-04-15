// Listen for incoming compressed Hex Strings ending in a newline
bluetooth.onUartDataReceived("\n", function () {
    message = bluetooth.uartReadUntil("\n")
    // Validate we received exactly 18 characters (9 bytes of hex data)
    if (message.length == 18) {
        // Byte 3 and 4 contain the Buttons (Indices 6 and 8 in the string)
        btn1 = parseInt("0x" + message.substr(6, 2))
        btn2 = parseInt("0x" + message.substr(8, 2))
        // Bytes 5, 6, 7, and 8 contain the Joysticks
        rightX = parseInt("0x" + message.substr(10, 2))
        rightY = parseInt("0x" + message.substr(12, 2))
        leftX = parseInt("0x" + message.substr(14, 2))
        leftY = parseInt("0x" + message.substr(16, 2))
        // Print the real-time joystick values to the PC's Serial Monitor!
        serial.writeLine("L-Joy[X:" + leftX + " Y:" + leftY + "] | R-Joy[X:" + rightX + " Y:" + rightY + "]")
    }
})
let leftY = 0
let leftX = 0
let rightY = 0
let rightX = 0
let btn2 = 0
let btn1 = 0
let message = ""
// Start the handshake on Channel 1
ElviraMando.startMando(9)
