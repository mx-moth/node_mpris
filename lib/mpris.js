var dbus = require('libdbus');

var interface = 'org.freedesktop.MediaPlayer';
var dummyCb = function() {};

var Player = function(name) {
	this.bus = dbus.sessionBus();
	this.name = name;
	this.busName = 'org.mpris.' . name;
};

Player.prototype.createMessage = function(path, method) {
	return dbus.createMethodCall('org.mpris.' + this.name, path, interface, method);
};

Player.prototype.send = function(message, callback) {
	try {
		callback = callback || dummyCb;
		this.bus.send(message, function(result) {
			callback(null, result);
		});
	} catch (err) {
		callback(err);
	}
};


([
	['Play', 'play'],
	['Pause', 'pause'],
	['Stop', 'stop'],
	['Next', 'nextTrack'],
	['Prev', 'previousTrack'],
]).forEach(function(method) {
	Player.prototype[method[1]] = function(callback) {
		this.send(this.createMessage('/Player', method[0]), callback);
	};
});

Player.prototype.setRepeat = function(repeat, callback) {
	var msg = dbus.createMethodCall(this.busName, '/Player', interface, 'Repeat');
	msg.appendArgs(repeat);
	this.send(msg, callback);
};

Player.prototype.getStatus = function(callback) {
	this.send(this.createMessage('/Player', 'GetStatus'), function(error, result) {
		if (error) return callback(error);

		var args = results.args();
		callback(null, {
			status: Player.status[args[0]],
			random: args[1] == 1,
			repeatTrack: args[2] == 1,
			repeatPlaylist: args[3] == 1,
		});
	});
};

exports.Player = Player;
