const SmartDevice = require('./SmartDevice');

class SmartCurtain extends SmartDevice {
    constructor(deviceId, deviceName, openPercentage = 0) {
        super(deviceId, deviceName);
        this._openPercentage = openPercentage;
    }
    setOpenPercentage(percent) {
        if (percent < 0 || percent > 100) throw new Error("打开百分比应为0~100之间");
        this._openPercentage = percent;
    }
    getDeviceType() { return "智能窗帘"; }
    getStatus() {
        return `${super.getStatus()}，打开百分比：${this._openPercentage}`;
    }
}

module.exports = SmartCurtain;
