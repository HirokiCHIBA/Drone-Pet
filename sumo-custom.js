"use strict";

var Sumo = require('node-sumo/lib/sumo');
var constants = require("node-sumo/lib/constants");

function networkFrameParser(buf) {
  var frame = {
    type: buf.readUInt8(0),
    id: buf.readUInt8(1),
    seq: buf.readUInt8(2),
    size: buf.readUInt32LE(3)
  };

  if (frame.size > 7) {
    frame.data = Buffer.concat([buf.slice(7, frame.size)]);
  }

  return frame;
}

function arstreamFrameParser(buf) {
  //
  // ARSTREAM_NetworkHeaders_DataHeader_t;
  //
  // uint16_t frameNumber;
  // uint8_t  frameFlags; // Infos on the current frame
  // uint8_t  fragmentNumber; // Index of the current fragment in current frame
  // uint8_t  fragmentsPerFrame; // Number of fragments in current frame
  //
  // * frameFlags structure :
  // *  x x x x x x x x
  // *  | | | | | | | \-> FLUSH FRAME
  // *  | | | | | | \-> UNUSED
  // *  | | | | | \-> UNUSED
  // *  | | | | \-> UNUSED
  // *  | | | \-> UNUSED
  // *  | | \-> UNUSED
  // *  | \-> UNUSED
  // *  \-> UNUSED
  // *
  //

  var frame = {
    frameNumber: buf.readUInt16LE(0),
    frameFlags: buf.readUInt8(2),
    fragmentNumber: buf.readUInt8(3),
    fragmentsPerFrame: buf.readUInt8(4),
  };

  frame.frame = Buffer.concat([buf.slice(5)]);

  return frame;
}

Sumo.prototype._packetReceiver = function(message) {
  var networkFrame = networkFrameParser(message);

  //
  // libARNetwork/Sources/ARNETWORK_Receiver.c#ARNETWORK_Receiver_ThreadRun
  //
  if (networkFrame.type === constants.ARNETWORKAL_FRAME_TYPE_DATA_WITH_ACK) {
    this._writePacket(this._createAck(networkFrame));
  }

  if (networkFrame.type === constants.ARNETWORKAL_FRAME_TYPE_DATA_LOW_LATENCY &&
      networkFrame.id === constants.BD_NET_DC_VIDEO_DATA_ID)
  {
    var arstreamFrame = arstreamFrameParser(networkFrame.data);
    this._writePacket(this._createARStreamACK(arstreamFrame));
  }

  //
  // libARCommands/Sources/ARCOMMANDS_Decoder.c#ARCOMMANDS_Decoder_DecodeBuffer
  //
  if (networkFrame.id === constants.BD_NET_DC_EVENT_ID) {
    var commandProject = networkFrame.data.readUInt8(0),
        commandClass = networkFrame.data.readUInt8(1),
        commandId = networkFrame.data.readUInt16LE(2);
    switch (commandProject) {
      case constants.ARCOMMANDS_ID_PROJECT_COMMON:
        switch (commandClass) {
          case constants.ARCOMMANDS_ID_COMMON_CLASS_COMMONSTATE:
            switch (commandId) {
              case constants.ARCOMMANDS_ID_COMMON_COMMONSTATE_CMD_BATTERYSTATECHANGED:
                this.navData.battery = networkFrame.data.readUInt8(4);
                this.emit("battery", this.navData.battery);
                break;
              case constants.ARCOMMANDS_ID_COMMON_COMMONSTATE_CMD_ALLSTATESCHANGED:
              case constants.ARCOMMANDS_ID_COMMON_COMMONSTATE_CMD_MASSSTORAGESTATELISTCHANGED:
              case constants.ARCOMMANDS_ID_COMMON_COMMONSTATE_CMD_MASSSTORAGEINFOSTATELISTCHANGED:
                break;
              default:
                console.log("Unhandled COMMON_CLASS_COMMONSTATE commandId: " + commandId);
                break;
            }
            break;
          default:
            console.log("Unhandled PROJECT_COMMON commandClass: " + commandClass + ", commandId: " + commandId);
            break;
        }
        break;
      case constants.ARCOMMANDS_ID_PROJECT_JUMPINGSUMO:
        switch (commandClass) {
          case constants.ARCOMMANDS_ID_JUMPINGSUMO_CLASS_PILOTINGSTATE:
            switch (commandId) {
              case constants.ARCOMMANDS_ID_JUMPINGSUMO_PILOTINGSTATE_CMD_POSTURECHANGED:
                var state = networkFrame.data.readInt32LE(4);
                switch(state) {
                  case constants.ARCOMMANDS_JUMPINGSUMO_PILOTINGSTATE_POSTURECHANGED_STATE_STANDING:
                    this.navData.posture = { standing: true };
                    this.emit("postureStanding");
                    break;
                  case constants.ARCOMMANDS_JUMPINGSUMO_PILOTINGSTATE_POSTURECHANGED_STATE_JUMPER:
                    this.navData.posture = { jumper: true };
                    this.emit("postureJumper");
                    break;
                  case constants.ARCOMMANDS_JUMPINGSUMO_PILOTINGSTATE_POSTURECHANGED_STATE_KICKER:
                    this.navData.posture = { kicker: true };
                    this.emit("postureKicker");
                    break;
                  case constants.ARCOMMANDS_JUMPINGSUMO_PILOTINGSTATE_POSTURECHANGED_STATE_STUCK:
                    this.navData.posture = { stuck: true };
                    this.emit("postureStuck");
                    break;
                  case constants.ARCOMMANDS_JUMPINGSUMO_PILOTINGSTATE_POSTURECHANGED_STATE_UNKNOWN:
                    this.navData.posture = { unknown: true };
                    this.emit("postureUnknown");
                    break;
                  default:
                    console.log("Unhandled JUMPINGSUMO_PILOTINGSTATE_POSTURECHANGED_STATE state: " + state);
                    break;
                }
                break;
              case constants.ARCOMMANDS_ID_JUMPINGSUMO_PILOTINGSTATE_CMD_ALERTSTATECHANGED:
                var state = networkFrame.data.readInt32LE(4);
                switch(state) {
                  case constants.ARCOMMANDS_JUMPINGSUMO_PILOTINGSTATE_ALERTSTATECHANGED_STATE_NONE:
                    this.navData.alertState = {};
                    break;
                  case constants.ARCOMMANDS_JUMPINGSUMO_PILOTINGSTATE_ALERTSTATECHANGED_STATE_CRITICAL_BATTERY:
                    this.navData.alertState = { batteryCritical: true };
                    this.emit("batteryCritical");
                    break;
                  case constants.ARCOMMANDS_JUMPINGSUMO_PILOTINGSTATE_ALERTSTATECHANGED_STATE_LOW_BATTERY:
                    this.navData.alertState = { batteryLow: true };
                    this.emit("batteryLow");
                    break;
                  default:
                    console.log("Unhandled JUMPINGSUMO_PILOTINGSTATE_ALERTSTATECHANGED_STATE state: " + state);
                    break;
                }
                break;
              default:
                console.log("Unhandled JUMPINGSUMO_CLASS_PILOTINGSTATE commandId: " + commandId);
                break;
            }
            break;
          case constants.ARCOMMANDS_ID_JUMPINGSUMO_CLASS_ANIMATIONSSTATE:
            switch (commandId) {
              case constants.ARCOMMANDS_ID_JUMPINGSUMO_ANIMATIONSSTATE_CMD_JUMPLOADCHANGED:
                var state = networkFrame.data.readInt32LE(4);
                switch(state) {
                  case constants.ARCOMMANDS_JUMPINGSUMO_ANIMATIONSSTATE_JUMPLOADCHANGED_STATE_UNKNOWN:
                    this.navData.jumpLoad = { unknown: true };
                    this.emit("jumpLoadUnknown");
                    break;
                  case constants.ARCOMMANDS_JUMPINGSUMO_ANIMATIONSSTATE_JUMPLOADCHANGED_STATE_UNLOADED:
                    this.navData.jumpLoad = { unloaded: true };
                    this.emit("jumpLoadUnloaded");
                    break;
                  case constants.ARCOMMANDS_JUMPINGSUMO_ANIMATIONSSTATE_JUMPLOADCHANGED_STATE_LOADED:
                    this.navData.jumpLoad = { loaded: true };
                    this.emit("jumpLoadLoaded");
                    break;
                  case constants.ARCOMMANDS_JUMPINGSUMO_ANIMATIONSSTATE_JUMPLOADCHANGED_STATE_BUSY:
                    this.navData.jumpLoad = { busy: true };
                    this.emit("jumpLoadBusy");
                  case constants.ARCOMMANDS_JUMPINGSUMO_ANIMATIONSSTATE_JUMPLOADCHANGED_STATE_LOW_BATTERY_UNLOADED:
                    this.navData.jumpLoad = { lowBatteryUnloaded: true };
                    this.emit("jumpLoadLowBatteryUnloaded");
                    break;
                  case constants.ARCOMMANDS_JUMPINGSUMO_ANIMATIONSSTATE_JUMPLOADCHANGED_STATE_LOW_BATTERY_LOADED:
                    this.navData.jumpLoad = { lowBatteryLoaded: true };
                    this.emit("jumpLoadLowBatteryLoaded");
                    break;
                  default:
                    console.log("Unhandled JUMPINGSUMO_ANIMATIONSSTATE_JUMPLOADCHANGED_STATE state: " + state);
                    break;
                }
                break;
              case constants.ARCOMMANDS_ID_JUMPINGSUMO_ANIMATIONSSTATE_CMD_JUMPMOTORPROBLEMCHANGED:
                var error = networkFrame.data.readInt32LE(4);
                switch(error) {
                  case constants.ARCOMMANDS_JUMPINGSUMO_ANIMATIONSSTATE_JUMPMOTORPROBLEMCHANGED_ERROR_NONE:
                    this.navData.jumpMotorError = {};
                    this.emit("jumpMotorOK");
                    break;
                  case constants.ARCOMMANDS_JUMPINGSUMO_ANIMATIONSSTATE_JUMPMOTORPROBLEMCHANGED_ERROR_BLOCKED:
                    this.navData.jumpMotorError = { blocked: true };
                    this.emit("jumpMotorErrorBlocked");
                    break;
                  case constants.ARCOMMANDS_JUMPINGSUMO_ANIMATIONSSTATE_JUMPMOTORPROBLEMCHANGED_ERROR_OVER_HEATED:
                    this.navData.jumpMotorError = { overheated: true};
                    this.emit("jumpMotorErrorOverheated");
                    break;
                  default:
                    console.log("Unhandled JUMPINGSUMO_ANIMATIONSSTATE_JUMPMOTORPROBLEMCHANGED_ERROR error: " + error);
                    break;
                }
                break;
              default:
                console.log("Unhandled JUMPINGSUMO_CLASS_ANIMATIONSSTATE commandId: " + commandId);
                break;
            }
            break;
          case constants.ARCOMMANDS_ID_JUMPINGSUMO_CLASS_NETWORKSTATE:
            switch (commandId) {
              case constants.ARCOMMANDS_ID_JUMPINGSUMO_NETWORKSTATE_CMD_LINKQUALITYCHANGED:
                break;
              default:
                console.log("Unhandled JUMPINGSUMO_CLASS_NETWORKSTATE commandId: " + commandId);
                break;
            }
            break;
          case constants.ARCOMMANDS_ID_JUMPINGSUMO_CLASS_MEDIASTREAMINGSTATE:
            switch (commandId) {
              case constants.ARCOMMANDS_ID_JUMPINGSUMO_MEDIASTREAMINGSTATE_CMD_VIDEOENABLECHANGED:
                break;
              default:
                console.log("Unhandled JUMPINGSUMO_CLASS_MEDIASTREAMINGSTATE commandId: " + commandId);
                break;
            }
            break;
          case constants.ARCOMMANDS_ID_JUMPINGSUMO_CLASS_MEDIARECORDSTATE:
            switch(commandId) {
              case constants.ARCOMMANDS_ID_JUMPINGSUMO_MEDIARECORDSTATE_CMD_PICTURESTATECHANGED:
                this.emit("internalPicture");
                break;
            }
            break;
          default:
            console.log("Unhandled PROJECT_JUMPINGSUMO commandClass: " + commandClass + ", commandId: " + commandId);
            break;
        }
        break;
      default:
        console.log("Unhandled commandProject: " + commandProject + ", commandClass: " + commandClass + ", commandId: " + commandId);
        break;
    }
  }

  //
  // libARNetwork/Sources/ARNETWORK_Receiver.c#ARNETWORK_Receiver_ThreadRun
  //
  if (networkFrame.id === constants.ARNETWORK_MANAGER_INTERNAL_BUFFER_ID_PING) {
    this.navData.runningTime = networkFrame.data.readUInt32LE(0) + (networkFrame.data.readUInt32LE(4) / 1000000000.0);
    this._writePacket(this._createPong(networkFrame));
  }
};

Sumo.prototype.takePicture = function(opts)
{
  //
  // ARCOMMANDS_Generator_GenerateARDrone3MediaRecordPicture
  //

  var buf = new Buffer(5);

  opts = opts || {};
  opts.storageId = opts.storageId || 0;

  buf.writeUInt8(constants.ARCOMMANDS_ID_PROJECT_JUMPINGSUMO, 0);
  buf.writeUInt8(constants.ARCOMMANDS_ID_JUMPINGSUMO_CLASS_MEDIARECORD, 1);
  buf.writeUInt16LE(constants.ARCOMMANDS_ID_JUMPINGSUMO_MEDIARECORD_CMD_PICTURE, 2);
  buf.writeUInt8(opts.storageId, 4);

  this._writePacket(this._networkFrameGenerator(buf));
  return this;
};

Sumo.prototype.startVideoStream = function()
{
  var buf = new Buffer(5);

  buf.writeUInt8(constants.ARCOMMANDS_ID_PROJECT_JUMPINGSUMO, 0);
  buf.writeUInt8(constants.ARCOMMANDS_ID_JUMPINGSUMO_CLASS_MEDIASTREAMING, 1);
  buf.writeUInt16LE(constants.ARCOMMANDS_ID_JUMPINGSUMO_MEDIASTREAMING_CMD_VIDEOENABLE, 2);
  buf.writeUInt8(constants.ARCOMMANDS_JUMPINGSUMO_MEDIASTREAMINGSTATE_VIDEOENABLECHANGED_ENABLED_ENABLED, 4);

  this._writePacket(this._networkFrameGenerator(buf));
  return this;
}

module.exports.constants = constants;

module.exports.createClient = function(opts) {
  return new Sumo(opts);
};
