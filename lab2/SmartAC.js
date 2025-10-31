const SmartDevice = require('./SmartDevice');

class SmartAC extends SmartDevice {
    constructor(deviceId, deviceName, temperature = 26, mode = "制冷") {
        super(deviceId, deviceName);
        this._temperature = temperature;
        this._mode = mode;
    }
    setTemperature(temp) {
        if (temp < 16 || temp > 32) throw new Error("温度应为16~32度之间");
        this._temperature = temp;
    }
    setMode(mode) {
        if (mode !== "制冷" && mode !== "制热") throw new Error("模式只能为'制冷'或'制热'");
        this._mode = mode;
    }
    getDeviceType() { return "智能空调"; }
    getStatus() {
        return `${super.getStatus()}，温度：${this._temperature}，模式：${this._mode}`;
    }
}

module.exports = SmartAC;
