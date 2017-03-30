var _ = require('busyman'),
    aesCmac = require('node-aes-cmac').aesCmac,
    crypto = require('crypto'),
    Nora_hal = require('./nora-hal.js'),
    SmartObject = require('smartobject'),
    nutils = require('./components/nutil.js');

var CNST = require('./constants.json'),
    REG = CNST.REG,
    MType = CNST.MType;

function NoraEndDeivce(nora, settings) {
    var self = this,
        nora = this.nora,
        devBox = nora._devBox,
        nora._endDeviceBox[settings.devAddr] = this;
        nwkSKeyData = '',
        appSKeyData = '',
        nwkSKey = crypto.createCipher('aes128', settings.appKey.toString(16)),
        appSKey = crypto.createCipher('aes128', settings.appKey.toString(16)),
        propUnwritable = { writable: false, enumerable: false, configurable: false };
    // members:
    //  info
    // mac option(class): A, B, C
    this._option = setting.option || {};
    if (this._option === 'A')
        this.transmitTiming = recordTiming;
    else if (this._option === 'B') {
        this.transmitTiming = pingSlotTiming;
    } else if (this._option === 'C') {
        this.transmitTiming = 0;
    }
    // control end-device instance operation or not
    //  true: instance is created, the information will be stored
    //  false: instance is created, the information will not be stored and api do not allow to used
    // this._operation = false;
    this.status = 'offline';
    // record linkCheckReq time
    this._gwCnt = 0;
    // record frame count
    this.count = 0;
    // The information do not want to modify on device instance
    // netId, devAddr, 
    var netId,
        // devAddr,
    // [ TODO] ping slot
    // Generate NwkSKey & AppSKey with AppKey, Check AES128 which way is used?
    // NwkSKey = aes128_encrypt(AppKey, 0x01 | AppNonce | NetID | DevNonce | pad16)
    // AppSKey = aes128_encrypt(AppKey, 0x02 | AppNonce | NetID | DevNonce | pad16)
    nwkSKeyData = nwkSKeyData.concat((0x01).toString(16), settings.appNonce.toString(16), settings.netId.toString(16), settings.devNonce.toString(16)/*, pad16(chList(optional))*/);
    appSKeyData = appSKeyData.concat((0x02).toString(16), settings.appNonce.toString(16), settings.netId.toString(16), settings.devNonce.toString(16)/*, pad16(chList(optional))*/);
    nwkSKey.update(nwkSKeyData);
    appSKey.update(appSKeyData);
    nwkSKey = nwkSKey.final();
    appSKey = appSKey.final();
    // Device Infomation
    Object.defineProperty(this, 'info', _.assign({
        value: {
            appEUI: settings.appEUI,
            devEUI: settings.devEUI,
            devNonce: settings.devNonce,
            appKey: settings.appKey,
            appNonce: settings.appNonce,
            netId: settings.netId,
            devAddr: settings.devAddr,
            appSKey: appSKey,
            nwkSKey: nwkSKey,
            _nwkId: (settings.devAddr >> 25),
            _nwkAddr: (settings.devAddr & 0x1ffffff),
            dump: self.dump()
        }
    }, propUnwritable));

    // this.netId = settings.netId.;
    // this.devAddr = settings.devAddr;
    // this._nwkId = (settings.devAddr >> 25);
    // this._nwkAddr = (settings.devAddr & 0x1ffffff);
    this.dlSettings = settings.dlSettings;
    this.rxDelay = settings.rxDelay;
    this.cfList = settings.cfList;
    this.nextPingSlotTime = {};
    // [TODO] what kind of information should be store
    devBox.add(this.info, function (err, id) {

    });
    this._registerd = false;
    this.joinTime = Math.floor(Date.now()/1000);
    this.so = new SmartObject();
    this.version = settings.version || '';
    this.lifetime = setting.lifetime || 86400;
    this.objList = setting.objList || {};
    // var object = {
    // clourse?
    // };
    // devBox information?
    // {
    //     devAddr: ,
    //     devEUI: ,
    //     appEUI: ,
    //     devNonce: ,
    //     appNonce: ,
    //     appSKey: ,
    //     nwkSKey: ,
    //     rxDelay: ,
    //     cfList: ,
    //     netId: ,
    //     nwkId: ,
    //     nwkAddr: ,
    //     dlSettings: ,
    //     _option: ,
    //     // nextPingSlotTime: ,
    //     version: ,
    //     lifetime: ,
    //     joinTime: ,
    //     objList: ,
    //     so: {
    //         device: {}
    //     }
    // }
}

NoraEndDeivce.prototype.dump = function (path, callback) {
    // store in database information
    // devAddr, netId, version, lifetime, joinTime, nextPingSlotTime, objList(so)
    // netId, rxDelay, cfList
    // endpoint?binding mdoe? sms number?
    return {
        option: this._option,
        devAddr: this.info.devAddr,
        netId: this.info.netId,
        devNonce: this.info.devNonce,
        version: this.version,
        lifetime: this.lifetime,
        joinTime: this.joinTime,
        nextPingSlotTime: this.nextPingSlotTime,
        objList: this.so
    };
};

NoraEndDeivce.prototype.readReq = function (path, callback) {
    // object id [MUST], object instance id , resource id [OPTIONAL]
    var self = this,
        result = { status: null, data: null },
        buf = [],
        pathContent,
        frmPayload = [];
    // [TODO] bootstrap check
    // path: '/object/object instance/resource'
    if (!_.isString(path))
        throw new TypeError('path should be a string.');
    // [TODO] judge path exist in nora or not, nora exist, register? so exist?
    if (!this._registerd)
        throw new TypeError('device is not registerd yet.');
    if (!(this.so instanceof SmartObject))
        throw new Error('No smart object bound to this node.');
    // [TODO] return database information? remote to read end-device value?
    // command cluster? use in appSKey(FPort)?
    return Q.fcall(function () {
        // [TODO] rxDelay. class option(A, B, C), transmit message
        //  class A: need to record the next uplink timing.
        //  calss B: be transmited at pingSlot except beaconPeriod timing
        //  class C: be transmited at any time except beaconPeriod timing
        if (self._option === 'A') {
            var nowTime = Math.floor(Date.now()/1000);
            if (self.nowTime)
        } else if (self._option === 'B') {

        } else if (self._option === 'C') {

        }
        // [TODO] check left time, if > 10 seconds, return error?
        buf.push(0xa0);
        // devAddr
        for (var i = 0;i < 4;i += 1)
            buf.push(((self.info.devAddr >> (8 * i)) & 0xff));
        // fctrl
        buf.push(0x00);
        // fport
        buf.push(0x09);
        pathContent = nutils.pathParserToArray(path);
        if (pathContent.length === 0 || pathContent.length > 3)
            throw new Error('path is incorrect.');
        // object ID, object instance ID, resource ID
        frmPayload.push(pathContent[0].value & 0xff); // number
        frmPayload.push((pathContent[0].value >> 8) & 0xff); // number
        if (pathContent.length > 1) {
            frmPayload.push(pathContent[1].length);    // string length
            for (var i = 0;i < pathContent[1].length;i += 1)
                frmPayload.push(pathContent[1][i].charCodeAt(0));   // string, ascii
        }
        if (pathContent.length > 2) {
            frmPayload.push(pathContent[2].value & 0xff); // number
            frmPayload.push((pathContent[2].value >> 8) & 0xff); // number
        }
        // encrypt frmPayload
        frmPayload = nutils.frmPayloadcrypto({devAddr: this.devAddr, count: this.count}, frmPayload, this.appSKey);
        for (var i = 0;i < frmPayload.length;i += 1)
            buf.push(frmPayload[i]);
        // add mic
        buf = nutils.generateMic(this, buf, 1);

        return buf;
        
    }).then(function (buf) {
        var data = new Buffer(buf);
        return nora._hal.send(data);
        // [TODO] wait rxDelay time, if no message, return error
        // setTimeout(function () {
            // [TODO] payload info: oid, iid, rid
        // }, self.rxDelay);
    }).nodeify(callback);
};

NoraEndDeivce.prototype.writeReq = function (path, value, callback) {
    // object id , object instance id, new value [MUST], resource id [OPTIONAL]
    // path: '/object/object instance/resource'
    // value is depend, it can be string, number, boolean, float...
    var self = this,
        result = { status: null, data: null },
        buf = [],
        pathContent,
        frmPayload = [];
    // [TODO] bootstrap check
    // path: '/object/object instance/resource'
    if (!_.isString(path))
        throw new TypeError('path should be a string.');
    // [TODO] judge path exist in nora or not, nora exist, register? so exist?
    if (!this._registerd)
        throw new TypeError('device is not registerd yet.');
    if (!(this.so instanceof SmartObject))
        throw new Error('No smart object bound to this node.');
    // [TODO] return database information? remote to read end-device value?
    // command cluster? use in appSKey(FPort)?
    return Q.fcall(function () {
        // [TODO] rxDelay. class option(A, B, C), transmit message
        //  class A: need to record the next uplink timing.
        //  calss B: be transmited at pingSlot except beaconPeriod timing
        //  class C: be transmited at any time except beaconPeriod timing
        if (self._option === 'A') {
            var nowTime = Math.floor(Date.now()/1000);
            if (self.nowTime)
        } else if (self._option === 'B') {

        } else if (self._option === 'C') {

        }
        // check left time, if > 10 seconds, return error?
        buf.push(0xa0);
        // devAddr
        for (var i = 0;i < 4;i += 1)
            buf.push(((self.devAddr >> (8 * i)) & 0xff));
        // fctrl
        buf.push(0x00);
        // fport
        buf.push(0x0a);
        pathContent = nutils.pathParserToArray(path);
        if (pathContent.length === 0 || pathContent.length > 3)
            throw new Error('path is incorrect.');
        // object ID, object instance ID, resource ID
        frmPayload.push(pathContent[0].value & 0xff); // number
        frmPayload.push((pathContent[0].value >> 8) & 0xff); // number
        frmPayload.push(pathContent[1].length);    // string length
        for (var i = 0;i < pathContent[1].length;i += 1)
            frmPayload.push(pathContent[1][i].charCodeAt(0));   // string, ascii
        if (pathContent.length > 2) {
            frmPayload.push(pathContent[2].value & 0xff); // number
            frmPayload.push((pathContent[2].value >> 8) & 0xff); // number
        }
        // set value, string? float? boolean? integer?
        frmPayload.push(value);
        // encrypt frmPayload
        frmPayload = nutils.frmPayloadcrypto({devAddr: this.devAddr, count: this.count}, frmPayload, this.appSKey);
        for (var i = 0;i < frmPayload.length;i += 1)
            buf.push(frmPayload[i]);
        // add mic
        buf = nutils.generateMic(this, buf, 1);

        var data = new Buffer(buf);
        return nora._hal.send(data);
    }).then(function () {
        // [TODO] wait rxDelay time, if no message, return error
        // setTimeout(function () {
            // [TODO] payload info: oid, iid, rid
        // }, self.rxDelay);
    }).nodeify(callback);
};

NoraEndDeivce.prototype.executeReq = function (path, args, callback) {
    // object id , object instance id , resource id [MUST], arguments [OPTIONAL]
    // path: '/object/object instance/resource'
    var self = this,
        result = { status: null, data: null },
        buf = [],
        pathContent,
        frmPayload = [];
    // [TODO] bootstrap check
    // path: '/object/object instance/resource'
    if (!_.isString(path))
        throw new TypeError('path should be a string.');
    // [TODO] judge path exist in nora or not, nora exist, register? so exist?
    if (!this._registerd)
        throw new TypeError('device is not registerd yet.');
    if (!(this.so instanceof SmartObject))
        throw new Error('No smart object bound to this node.');
    if (_.isFunction(args))
        callback = args;
    else if (!_.isArray(args))
        throw new TypeError('args should be an array.');
    // [TODO] return database information? remote to read end-device value?
    // command cluster? use in appSKey(FPort)?
    return Q.fcall(function () {
        // [TODO] rxDelay. class option(A, B, C), transmit message
        //  class A: need to record the next uplink timing.
        //  calss B: be transmited at pingSlot except beaconPeriod timing
        //  class C: be transmited at any time except beaconPeriod timing
        if (self._option === 'A') {
            var nowTime = Math.floor(Date.now()/1000);
            if (self.nowTime)
        } else if (self._option === 'B') {

        } else if (self._option === 'C') {

        }
        // check left time, if > 10 seconds, return error?
        buf.push(0xa0);
        // devAddr
        for (var i = 0;i < 4;i += 1)
            buf.push(((self.devAddr >> (8 * i)) & 0xff));
        // fctrl
        buf.push(0x00);
        // fport
        buf.push(0x0b);
        pathContent = nutils.pathParserToArray(path);
        if (pathContent.length !== 3)
            throw new Error('path is incorrect.');
        // object ID, object instance ID, resource ID
        frmPayload.push(pathContent[0].value & 0xff); // number
        frmPayload.push((pathContent[0].value >> 8) & 0xff); // number
        frmPayload.push(pathContent[1].length);    // string length
        for (var i = 0;i < pathContent[1].length;i += 1)
            frmPayload.push(pathContent[1][i].charCodeAt(0));   // string, ascii
        frmPayload.push(pathContent[2].value & 0xff); // number
        frmPayload.push((pathContent[2].value >> 8) & 0xff); // number
        // set args
        if (_.isArray(args)) {
            for (var i = 0;i < args.length;i += 1)
                frmPayload.push(args[i]);
        }
        // encrypt frmPayload
        frmPayload = nutils.frmPayloadcrypto({devAddr: self.devAddr, count: self.count}, frmPayload, self.appSKey);
        for (var i = 0;i < frmPayload.length;i += 1)
            buf.push(frmPayload[i]);
        // add mic
        buf = nutils.generateMic(self, buf, 1);

        var data = new Buffer(buf);
        return nora._hal.send(data);
    }).then(function () {
        // [TODO] wait rxDelay time, if no message, return error
        // setTimeout(function () {
            // [TODO] payload info: oid, iid, rid
        // }, self.rxDelay);
    }).nodeify(callback);
};

NoraEndDeivce.prototype.writeAttrsReq = function (path, attrs, callback) {
    // object id [MUST], object instance id , resource id [OPTIONAL]
    // path: '/object/object instance/resource'
    var self = this,
        result = { status: null, data: null },
        buf = [],
        pathContent,
        frmPayload = [];
    // [TODO] bootstrap check
    // path: '/object/object instance/resource'
    if (!_.isString(path))
        throw new TypeError('path should be a string.');
    // [TODO] judge path exist in nora or not, nora exist, register? so exist?
    if (!this._registerd)
        throw new TypeError('device is not registerd yet.');
    if (!(this.so instanceof SmartObject))
        throw new Error('No smart object bound to this node.');
    if (_.isFunction(args))
        callback = args;
    // [TODO] return database information? remote to read end-device value?
    // command cluster? use in appSKey(FPort)?
    return Q.fcall(function () {
        // [TODO] rxDelay. class option(A, B, C), transmit message
        //  class A: need to record the next uplink timing.
        //  calss B: be transmited at pingSlot except beaconPeriod timing
        //  class C: be transmited at any time except beaconPeriod timing
        if (self._option === 'A') {
            var nowTime = Math.floor(Date.now()/1000);
            if (self.nowTime)
        } else if (self._option === 'B') {

        } else if (self._option === 'C') {

        }
        // check left time, if > 10 seconds, return error?
        buf.push(0xa0);
        // devAddr
        for (var i = 0;i < 4;i += 1)
            buf.push(((self.devAddr >> (8 * i)) & 0xff));
        // fctrl
        buf.push(0x00);
        // fport
        buf.push(0x0f);
        pathContent = nutils.pathParserToArray(path);
        if (pathContent.length === 0 || pathContent.length > 3)
            throw new Error('path is incorrect.');
        // object ID, object instance ID, resource ID
        frmPayload.push(pathContent[0].value & 0xff); // number
        frmPayload.push((pathContent[0].value >> 8) & 0xff); // number
        if (pathContent.length > 1) {
            frmPayload.push(pathContent[1].length);    // string length
            for (var i = 0;i < pathContent[1].length;i += 1)
                frmPayload.push(pathContent[1][i].charCodeAt(0));   // string, ascii
        }
        if (pathContent.length > 2) {
            frmPayload.push(pathContent[2].value & 0xff); // number
            frmPayload.push((pathContent[2].value >> 8) & 0xff); // number
        }
        // set class attributes
        frmPayload.push(attrs);
        // encrypt frmPayload
        frmPayload = nutils.frmPayloadcrypto({devAddr: this.devAddr, count: this.count}, frmPayload, this.appSKey);
        for (var i = 0;i < frmPayload.length;i += 1)
            buf.push(frmPayload[i]);
        // add mic
        buf = nutils.generateMic(this, buf, 1);

        var data = new Buffer(buf);
        return nora._hal.send(data);
    }).then(function () {
        // [TODO] wait rxDelay time, if no message, return error
        // setTimeout(function () {
            // [TODO] payload info: oid, iid, rid
        // }, self.rxDelay);
    }).nodeify(callback);
};

NoraEndDeivce.prototype.discoverReq = function (path, callback) {
    // object id [MUST], object instance id , resource id [OPTIONAL]
    // path: '/object/object instance/resource'
    var self = this,
        result = { status: null, data: null },
        buf = [],
        pathContent,
        frmPayload = [];
    // [TODO] bootstrap check
    // path: '/object/object instance/resource'
    if (!_.isString(path))
        throw new TypeError('path should be a string.');
    // [TODO] judge path exist in nora or not, nora exist, register? so exist?
    if (!this._registerd)
        throw new TypeError('device is not registerd yet.');
    if (!(this.so instanceof SmartObject))
        throw new Error('No smart object bound to this node.');
    if (_.isFunction(args))
        callback = args;
    // [TODO] return database information? remote to read end-device value?
    // command cluster? use in appSKey(FPort)?
    return Q.fcall(function () {
        // [TODO] rxDelay. class option(A, B, C), transmit message
        //  class A: need to record the next uplink timing.
        //  calss B: be transmited at pingSlot except beaconPeriod timing
        //  class C: be transmited at any time except beaconPeriod timing
        if (self._option === 'A') {
            var nowTime = Math.floor(Date.now()/1000);
            if (self.nowTime)
        } else if (self._option === 'B') {

        } else if (self._option === 'C') {

        }
        // check left time, if > 10 seconds, return error?
        buf.push(0xa0);
        // devAddr
        for (var i = 0;i < 4;i += 1)
            buf.push(((self.devAddr >> (8 * i)) & 0xff));
        // fctrl
        buf.push(0x00);
        // fport
        buf.push(0x0e);
        pathContent = nutils.pathParserToArray(path);
        if (pathContent.length === 0 || pathContent.length > 3)
            throw new Error('path is incorrect.');
        // object ID, object instance ID, resource ID
        frmPayload.push(pathContent[0].value & 0xff); // number
        frmPayload.push((pathContent[0].value >> 8) & 0xff); // number
        if (pathContent.length > 1) {
            frmPayload.push(pathContent[1].length);    // string length
            for (var i = 0;i < pathContent[1].length;i += 1)
                frmPayload.push(pathContent[1][i].charCodeAt(0));   // string, ascii
        }
        if (pathContent.length > 2) {
            frmPayload.push(pathContent[2].value & 0xff); // number
            frmPayload.push((pathContent[2].value >> 8) & 0xff); // number
        }
        // encrypt frmPayload
        frmPayload = nutils.frmPayloadcrypto({devAddr: this.devAddr, count: this.count}, frmPayload, this.appSKey);
        for (var i = 0;i < frmPayload.length;i += 1)
            buf.push(frmPayload[i]);
        // add mic
        buf = nutils.generateMic(this, buf, 1);

        var data = new Buffer(buf);
        return nora._hal.send(data);
    }).then(function () {
        // [TODO] wait rxDelay time, if no message, return error
        // setTimeout(function () {
            // [TODO] payload info: oid, iid, rid
        // }, self.rxDelay);
    }).nodeify(callback);
};

NoraEndDeivce.prototype.observeReq = function (path, opt, callback) {
    // object id [MUST], object instance id , resource id [OPTIONAL]
    // path: '/object/object instance/resource'
    // opt: true: observe, false: cancel observe
    var self = this,
        result = { status: null, data: null },
        buf = [],
        pathContent,
        frmPayload = [];
    // [TODO] bootstrap check
    // path: '/object/object instance/resource'
    if (!_.isString(path))
        throw new TypeError('path should be a string.');
    // [TODO] judge path exist in nora or not, nora exist, register? so exist?
    if (!this._registerd)
        throw new TypeError('device is not registerd yet.');
    if (!(this.so instanceof SmartObject))
        throw new Error('No smart object bound to this node.');
    if (_.isFunction(args))
        callback = args;
    // [TODO] return database information? remote to read end-device value?
    // command cluster? use in appSKey(FPort)?
    return Q.fcall(function () {
        // [TODO] rxDelay. class option(A, B, C), transmit message
        //  class A: need to record the next uplink timing.
        //  calss B: be transmited at pingSlot except beaconPeriod timing
        //  class C: be transmited at any time except beaconPeriod timing
        if (self._option === 'A') {
            var nowTime = Math.floor(Date.now()/1000);
            if (self.nowTime)
        } else if (self._option === 'B') {

        } else if (self._option === 'C') {

        }
        // check left time, if > 10 seconds, return error?
        buf.push(0xa0);
        // devAddr
        for (var i = 0;i < 4;i += 1)
            buf.push(((self.devAddr >> (8 * i)) & 0xff));
        // fctrl
        buf.push(0x00);
        // fport
        if (opt)
            buf.push(0x10); // observation
        else
            buf.push(0x11); // cancel observation
        pathContent = nutils.pathParserToArray(path);
        if (pathContent.length === 0 || pathContent.length > 3)
            throw new Error('path is incorrect.');
        // object ID, object instance ID, resource ID
        frmPayload.push(pathContent[0].value & 0xff); // number
        frmPayload.push((pathContent[0].value >> 8) & 0xff); // number
        if (pathContent.length > 1) {
            frmPayload.push(pathContent[1].length);    // string length
            for (var i = 0;i < pathContent[1].length;i += 1)
                frmPayload.push(pathContent[1][i].charCodeAt(0));   // string, ascii
        }
        if (pathContent.length > 2) {
            frmPayload.push(pathContent[2].value & 0xff); // number
            frmPayload.push((pathContent[2].value >> 8) & 0xff); // number
        }
        // encrypt frmPayload
        frmPayload = nutils.frmPayloadcrypto({devAddr: this.devAddr, count: this.count}, frmPayload, this.appSKey);
        for (var i = 0;i < frmPayload.length;i += 1)
            buf.push(frmPayload[i]);
        // add mic
        buf = nutils.generateMic(this, buf, 1);

        var data = new Buffer(buf);
        return nora._hal.send(data);
    }).then(function () {
        // [TODO] wait rxDelay time, if no message, return error
        // setTimeout(function () {
            // [TODO] payload info: oid, iid, rid
        // }, self.rxDelay);
    }).nodeify(callback);
};

// Bootstrap
// NoraEndDeivce.prototype.bsDiscover = function (path, callback) {
//     // path: '/object/object instance/resource'
// };

// NoraEndDeivce.prototype.bsWrite = function (path, callback) {
//     // path: '/object/object instance/resource'
// };

// [TODO] SmartObject pull high layer to handle ?
// NoraEndDeivce.prototype.read = function (configName, callback) {
    // [TODO] read the value of end-device txPower, dataRate, cfList...
// };

// NoraEndDeivce.prototype.dump = function (callback) {
    // [TODO] dump the information of end-device(txPower, dataRate, cfList...)
// };

module.exports = NoraEndDeivce;