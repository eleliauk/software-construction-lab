const HomeManager = require('./HomeManager');
const SmartLight = require('./SmartLight');
const SmartAC = require('./SmartAC');
const SmartCurtain = require('./SmartCurtain');
const SmartTV = require('./SmartTV');
const SceneMode = require('./SceneMode');

const manager = new HomeManager();
const lamp = new SmartLight("001", "卧室灯", 75);
const ac = new SmartAC("002", "客厅空调", 24, "制冷");
const curtain = new SmartCurtain("003", "阳台窗帘", 50);
const tv = new SmartTV("004", "客厅电视", 5, 40);

manager.addDevice(lamp);
manager.addDevice(ac);
manager.addDevice(curtain);
manager.addDevice(tv);

lamp.setBrightness(80);
ac.setTemperature(26);
tv.setChannel(6);
tv.setVolume(33);
curtain.setOpenPercentage(90);

console.log("所有设备状态：");
manager.displayAllDevices();

// 异常处理测试
try {
    manager.turnOnDevice("999");
} catch(e) {console.log("异常测试-设备不存在:", e.message);}
try {
    tv.setVolume(120);
} catch(e) {console.log("异常测试-音量无效:", e.message);}

// 场景模式测试
const scene = new SceneMode("夜间模式");
scene.addAction(lamp, function() {this.turnOff();});
scene.addAction(ac, function() {this.setMode("制热"); this.setTemperature(22);});
scene.addAction(tv, function() {this.turnOn(); this.setVolume(18);});
scene.applyScene();
console.log("\n夜间模式应用后：");
manager.displayAllDevices();
