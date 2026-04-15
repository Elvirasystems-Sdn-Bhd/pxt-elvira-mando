// 1. Start the MandoBit handshake and background listener on Channel 9
MandoBit.startMando(9)
// 2. Main loop
basic.forever(function () {
    // --- FORWARD & BACKWARD (Buttons) ---
    // --- TURNING (Left Joystick X-Axis) ---
    // Pushed Left (Values approach 0)
    // Pushed Right (Values approach 255)
    // --- IDLE / STOP ---
    // If no buttons are pressed and the joystick is near the center (100 to 155)
    if (MandoBit.isButton2Pressed(MandoBit.MandoButton2.Cross)) {
        motionbit.runMotor(MotionBitMotorChannel.M1, MotionBitMotorDirection.Forward, 255)
        motionbit.runMotor(MotionBitMotorChannel.M3, MotionBitMotorDirection.Forward, 255)
    } else if (MandoBit.isButton2Pressed(MandoBit.MandoButton2.Circle)) {
        motionbit.runMotor(MotionBitMotorChannel.M1, MotionBitMotorDirection.Backward, 255)
        motionbit.runMotor(MotionBitMotorChannel.M3, MotionBitMotorDirection.Backward, 255)
    } else if (MandoBit.getLeftJoyX() < 100) {
        motionbit.runMotor(MotionBitMotorChannel.M1, MotionBitMotorDirection.Backward, 255)
        motionbit.runMotor(MotionBitMotorChannel.M3, MotionBitMotorDirection.Forward, 255)
    } else if (MandoBit.getLeftJoyX() > 155) {
        motionbit.runMotor(MotionBitMotorChannel.M1, MotionBitMotorDirection.Forward, 255)
        motionbit.runMotor(MotionBitMotorChannel.M3, MotionBitMotorDirection.Backward, 255)
    } else {
        motionbit.brakeMotor(MotionBitMotorChannel.All)
    }
    // Small pause to prevent crashing the micro:bit processor
    basic.pause(20)
})
