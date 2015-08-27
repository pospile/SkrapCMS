exports.clear = function() {
	return process.stdout.write('\033c');
};

