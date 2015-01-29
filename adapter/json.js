var fs = require('fs');
var path = require('path');

var JSONFileAdapter = function(config) {
    this.config = config;
}

JSONFileAdapter.prototype = Object.create(Object.prototype);

JSONFileAdapter.prototype.filenameForLanguage = function(language) {
    return path.join('language_' + language + '.json');
}


JSONFileAdapter.prototype.read = function read(filename, callback) {
    fs.readFile(filename, function(err, data) {
        if(err) {
            return callback(err, {});
        }

        callback(err, JSON.parse(data));
    })
}

JSONFileAdapter.prototype.write = function write(filename, data, callback) {
    fs.writeFile(filename, JSON.stringify(data, null, 4), function(err) {
        callback(err, data);
    })
}

module.exports = JSONFileAdapter;
