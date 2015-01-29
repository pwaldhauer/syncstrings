var path = require('path');
var i18nStringsFiles = require('i18n-strings-files');

var StringsFileAdapter = function(config) {
    this.config = config;
}

StringsFileAdapter.prototype = Object.create(Object.prototype);

StringsFileAdapter.prototype.filenameForLanguage = function(language) {
    if(language === this.config.base) {
        language = 'Base';
    }

    return path.join(language + '.lproj', 'Localizable.strings');
}

StringsFileAdapter.prototype.read = function read(filename, callback) {
    i18nStringsFiles.readFile(filename, 'UTF-16', callback);
}

StringsFileAdapter.prototype.write = function write(filename, data, callback) {
    i18nStringsFiles.writeFile(filename, data, 'UTF-16', callback);
}

module.exports = StringsFileAdapter;
