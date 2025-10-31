class HomeManager {
    constructor() {
        this.devices = [];
    }
    addDevice(device) {
        // 只允许添加SmartDevice子类
        if (!device || typeof device.getDeviceType !== 'function') throw new Error("只能添加SmartDevice子类");
        if (this.devices.find(d => d.deviceId === device.deviceId)) throw new Error("设备ID已存在！");
        this.devices.push(device);
    }
    removeDevice(deviceId) {
        const index = this.devices.findIndex(d => d.deviceId === deviceId);
        if (index === -1) throw new Error("设备不存在！");
        this.devices.splice(index, 1);
    }
    turnOnDevice(deviceId) {
        const device = this.devices.find(d => d.deviceId === deviceId);
        if (!device) throw new Error("设备不存在！");
        if (typeof device.turnOn !== 'function') throw new Error("该设备无法被打开");
        device.turnOn();
    }
    turnOffDevice(deviceId) {
        const device = this.devices.find(d => d.deviceId === deviceId);
        if (!device) throw new Error("设备不存在！");
        if (typeof device.turnOff !== 'function') throw new Error("该设备无法被关闭");
        device.turnOff();
    }
    displayAllDevices() {
        this.devices.forEach(device => {
            console.log(`${device.deviceName}（${device.getDeviceType()}）：${device.getStatus()}`);
        });
    }
}

module.exports = HomeManager;
