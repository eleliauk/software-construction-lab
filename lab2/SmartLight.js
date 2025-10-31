const SmartDevice = require('./SmartDevice');

class SmartLight extends SmartDevice {
    constructor(deviceId, deviceName, brightness = 100) {
        super(deviceId, deviceName);
        this._brightness = brightness;
    }
    setBrightness(level) {
        if (level < 0 || level > 100) throw new Error("亮度应为0~100之间");
        this._brightness = level;
    }
    getBrightness() { return this._brightness; }
    getDeviceType() { return "智能灯"; }
    getStatus() {
        return `${super.getStatus()}，亮度：${this._brightness}`;
    }
}

module.exports = SmartLight;
