# syncstrings

Managing Localizable.strings files sucks. Translating them with a team sucks. This tool syncs your local .strings files with a Google Spreadsheet to allow easy collaboration on your localization.

## Usage

`syncstrings -c [path to config file]`

## What does the tool do?

1. Load your configuration
2. Connect to the configured spreadsheet and load all definded strings
3. Load the local strings file and overwrite all strings with the corresponding strings from the spreadsheet
4. Upload all new keys to the spreadsheet
5. Save your local strings file

## How should the config look like?

```json

{

    "google": {
        "spreadsheetId": "spreadsheet id", # the ID of the spreadsheet. Look in your browsers address bar
        "worksheetName": "Translation",    # the title of the worksheet to use
        "username": "example@gmail.com",
        "password": "hihihi"
    },

    "translation": {
        "basePath": "path/to/project/directory", # path to the directory that contains the "language".lproj files
        "startRow": "2", # Importing will start at this row. 1-based. Start at 2 to leave room for a headline
        "keyRow": "1", # Column to put the keys in (yeah, it should be called keyColumn)
        "commentRow": "2", # Column to put the comments (currently not supported)
        "languages": {  # Object containing "Name of language" => "number of column to put stuff in"
            "Base": "3"
        }
    }

}

```

## How should the spreadsheet look like?

## How should I update mit local strings file after adding new keys to my source?

This sucks. But fortunately there is a REALLY nice tool to do the job. Just buy [LocalizableStringsMerge](http://www.delitestudio.com/app/localizable-strings-merge/) and stay happy.

(But you'll need to remove the /* NEW */ flags it creates prior to syncing the strings)

## Known bugs

This is a quickly developed script which works for me, but I think it could be useful for others. Theoretically it should support multiple languages, but this is currently untested.
