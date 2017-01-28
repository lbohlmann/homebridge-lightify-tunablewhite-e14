var lightify = require('node-lightify');
var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory("homebridge-lightify-tunablewhite-e14", "LightifyBulb", LightifyAccessory);
}

function LightifyAccessory(log, config) {
    this.log = log;
    this.config = config;
    this.name = config["name"];

    this.ip = config["ip"];
    this.mac = config["mac"];

    this.connection = new lightify.lightify(this.ip);
    this.connection.connect(this.ip)

    this.service = new Service.Lightbulb(this.name);
    this.service
        .getCharacteristic(Characteristic.On)
        .on('get', this.getOn.bind(this))
        .on('set', this.setOn.bind(this));
    this.service
        .getCharacteristic(Characteristic.Brightness)
        .on('get', this.getBrightness.bind(this))
        .on('set', this.setBrightness.bind(this));
    this.service
        .getCharacteristic(Characteristic.Hue)
        .on('get', this.getHue.bind(this))
        .on('set', this.setHue.bind(this));
    this.service
        .getCharacteristic(Characteristic.Saturation)
        .on('get', this.getSaturation.bind(this))
        .on('set', this.setSaturation.bind(this));
}

LightifyAccessory.prototype.getOn = function(callback) {
    return this.connection.getStatus(this.mac).then(data => {
        console.log("Requesting Status of " + this.name);
        console.log("Returning Value: " + data.status == 1);
        callback(null, data.status == 1);
    }).catch(error => {
        console.log(error);
        callback(null, false);
    });
}

LightifyAccessory.prototype.getBrightness = function(callback) {
    return this.connection.getStatus(this.mac).then(data => {
        console.log("Requesting Brightness of " + this.name);
        console.log("Returning Value: " + data.brightness);
        callback(null, data.brightness);
    }).catch(function(error){
        console.log(error);
        callback(null, 0);
    });
}

LightifyAccessory.prototype.getHue = function(callback) {
    return this.connection.getStatus(this.mac).then(data => {
        console.log("Requesting Color Temperature of " + this.name);
        var ctemp;
        if(data.hue <= 180){
            ctemp = ((data.hue/180.0)*7000.0)+1000.0;
        }else{
            ctemp = (((180-(data.hue-180))/180.0)*7000.0)+1000.0;
        }
        console.log("Returning Value: " + ctemp);
        callback(null, ctemp);
    }).catch(function(error){
        console.log(error);
        callback(null, 0);
    });
}

LightifyAccessory.prototype.getSaturation = function(callback) {
    callback(null, 1);
}

LightifyAccessory.prototype.setOn = function(on, callback) {
    return this.connection.nodeOnOff(this.mac, on).then(data => {
        console.log("Turning on " + this.name);
        console.log("Success: " + data.result[0].success == 1);
        callback(null, data.success == 1);
    }).catch(function(error){
        console.log(error);
        callback(null, false);
    });
}

LightifyAccessory.prototype.setBrightness = function(brightness, callback) {
    return this.connection.nodeBrightness(this.mac, brightness, 0).then(data => {
        console.log("Setting Brightness of " + this.name + " to " + brightness);
        console.log("Success: " + data.result[0].success == 1);
        callback(null, data.success == 1);
    }).catch(function(error){
        console.log(error);
        callback(null, false);
    });
}

LightifyAccessory.prototype.setHue = function(hue, callback) {
    console.log("Hue: " + hue);
    var ctemp;
    if(hue <= 180){
        ctemp = ((hue/180.0)*7000.0)+1000.0;
    }else{
        ctemp = (((180-(hue-180))/180.0)*7000.0)+1000.0;
    }
    return this.connection.nodeTemperature(this.mac, ctemp, 0).then(data => {
        console.log("Setting Color Temperature of " + this.name + " to " + ctemp);
        console.log("Success: " + data.result[0].success == 1);
        callback(null, data.success == 1);
    }).catch(function(error){
        console.log(error);
        callback(null, false);
    });
    
}

LightifyAccessory.prototype.setSaturation = function(saturation, callback) {
    console.log("Saturation: " + saturation);
    callback(null, true);
}

LightifyAccessory.prototype.getServices = function() {
    return [this.service];
}