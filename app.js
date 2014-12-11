#!/usr/bin/env node

var i18nStringsFiles = require('i18n-strings-files');
var Spreadsheet = require('edit-google-spreadsheet');
var async = require('async');
var path = require('path');
var _ = require('underscore');
var argv = require('optimist')
    .usage('Usage: $0 -c [path to config]')
    .demand(['c'])
    .argv;

var config = require(path.resolve(argv.c));

async.waterfall([

    function loadSpreadsheet(callback) {
        Spreadsheet.load({
            debug: false,
            spreadsheetId: config.google.spreadsheetId,
            worksheetName: config.google.worksheetName,
            username: config.google.username,
            password: config.google.password,
            autoSize: true
        }, function sheetReady(err, spreadsheet) {
            callback(null, spreadsheet);
        });
    },

    function loadStringsFromSpreadsheet(spreadsheet, callback) {
        var languages = {};
        for (var i in config.translation.languages) {
            languages[i] = {};
        }

        spreadsheet.receive(function(err, rows, info) {
            console.log(err);

            for (var i in rows) {
                if (parseInt(i) < parseInt(config.translation.startRow)) {
                    continue;
                }

                var key = rows[i][config.translation.keyRow];

                for (var o in config.translation.languages) {
                    languages[o][key] = rows[i][config.translation.languages[o]];
                }
            }

            callback(null, spreadsheet, languages);
        });
    },

    function readWriteLocalFiles(spreadsheet, languages, callback) {
        var to_sync = {};

        var queue = async.queue(function(item, callback) {
            var strings = languages[item];
            var filename = path.join(config.translation.basePath, item + '.lproj', 'Localizable.strings');

            i18nStringsFiles.readFile(filename, 'UTF-16', function(err, data) {
                // search for strings that are not online
                for (var i in data)  {
                    // web file has string ... update local copy else add it to sync queue
                    console.log('Searching for  ' + i + ' in current translation. ');

                    if (!strings.hasOwnProperty(i)) {
                        to_sync[i] = data[i];
                    }
                }

                // overwrite all other strings with the online strings
                for (var i in strings) {
                    data[i] = _.isUndefined(strings[i]) ? '' : strings[i];
                }

                console.log('new strings to sync upwards:');
                console.log(to_sync);

                i18nStringsFiles.writeFile(filename, data, 'UTF-16', function(err, data) {
                    callback(null);
                });


            });
        });

        queue.drain = function() {
            callback(null, spreadsheet, languages, to_sync);
        }

        queue.push(Object.keys(languages));
    },

    function writeSpreadsheet(spreadsheet, languages, to_sync, callback) {
        var row = Object.keys(languages['Base']).length + parseInt(config.translation.startRow);
        for (var i in to_sync) {
            var string = to_sync[i];

            var rowObject = {};
            rowObject[row] = {};
            rowObject[row][config.translation.keyRow] = i;

            for (var o in config.translation.languages) {
                rowObject[row][config.translation.languages[o]] = string;
            }

            spreadsheet.add(rowObject);

            console.log(rowObject);

            row++;
        }

        spreadsheet.send(function(err) {
            console.log("Updated spreadsheet");

            callback(null);
        });
    }


]);
