var request = require('request');
var n       = require('ncallbacks');
var _       = require('underscore');
var argv    = require('optimist').argv;

var version = argv.version;
var username = argv.username;
var password = argv.password;
var no_app = argv.no_app;
var platforms = argv.platforms;
var summary = argv.summary;
var description = argv.description;

var JIRA_PROJECT_KEY = "CB";

var parent_issue = {
    "fields":{
        "project":{
            "key":JIRA_PROJECT_KEY
        },
        "summary":"Tag " + version,
        "description":"Parent issue to track the release steps for " + version + ".",
        "issuetype":{
            "name":"Task"
        }
    }
};
var sub = {
    "fields":{
        "project":{
            "key":JIRA_PROJECT_KEY
        },
        "parent":{
            "key":""
        },
        "summary":"",
        "description":"",
        "issuetype":{
            "name":"Sub-task"
        }
    }
};
var platform_labels = ['Android', 'Bada', 'FirefoxOS', 'BlackBerry', 'iOS', 'OSX', 'Qt', 'Tizen', 'webOS', 'Windows 8', 'WP7', 'WP8'];

function usage() {
    console.log("Usage: node jira.js --username=<username> --password=<password>");
    console.log("Additionally, you can either create a task for tagging a release, or create a generic top-level issue.");
    console.log("TAGGING A RELEASE:");
    console.log("    node jira.js --username=<blah> --password=<blah> --version=<version> [--no_app]");
    console.log("<version> is a version string such as 2.4.0rc1, 2.7.1, 3.0.1, etc.");
    console.log("The --no_app parameter will not create subtasks to update the hello-world application (in case no changes went into it).");
    console.log("Example: node jira.js --version=2.3.0rc2 --username=fil --password=poop");
    console.log("CREATING A TOP-LEVEL ISSUE:");
    console.log("    node jira.js --username=<blah> --password=<blah> --summary=\"my new feature\" --description=\"this is a new feature\" [--platforms=\"<platform>,<platform>]\"");
    console.log("Make sure to provide both a summary and description (and include double quotes, as you generally want spaces in there).");
    console.log("The --platforms parameter allows you to specify specific platforms to tag as sub-issues.");
    console.log("By default, each issue will have a JavaScript, Docs and mobile-spec (tests) sub-issue created.");
    console.log("By default, the core platforms (Android, iOS, BlackBerry, Windows Phone 7 + 8, Windows 8 and FirefoxOS) will be included as sub-issues.");
    console.log("Acceptable platform strings are: android, ios, blackberry, wp7, wp8, windows8, firefoxos, webos, tizen, qt, osx");
    console.log("Example: node jira.js --username=fil --password=poop --summary=\"Add 'blow up phone' feature\" --description=\"add a new api (`window.blowup`) that will allow you to destroy a phone.\"");
}
function create(json, callback) {
    var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
    request.post({
        'uri':API_URL + 'issue',
        'headers':{
            'Authorization':auth
        },
        'json':json
    }, callback);
}
function subtask(parent, summary, description, component, version) {
    var obj = _.clone(sub);
    obj.fields.parent = {"key":parent};
    obj.fields.summary = summary;
    obj.fields.description = description;
    obj.fields.components = [];
    obj.fields.components.push({"id":component});
    obj.fields.fixVersions = [];
    obj.fields.fixVersions.push({"id":version});
    return obj;
}

if (!username || !password) {
    console.error("At a minimum, you need to provide your Apache JIRA username and password.");
    usage();
    return;
}
if (!summary && !version) {
    console.error("When using this script, you either need to provide a summary with description or a version string.");
    usage();
    return;
}

var API_URL = "https://issues.apache.org/jira/rest/api/latest/";

// first, get list of Components
request.get(API_URL + 'project/' + JIRA_PROJECT_KEY + '/components', function(err, res, components) {
    if (err) throw ("ERROR GETTING COMPONENTS ZOMG!!!" + err);
    if (!components) {
        console.log("wtf no components in JIRA?", components);
    } else {
        // set up a simple component map
        components = JSON.parse(components);
        var component_map = {};
        components.forEach(function(c) {
            component_map[c.name] = c.id;
        });
        console.log('Retrieved list of Components in JIRA.');

        // get list of fix-version
        request.get(API_URL + 'project/' + JIRA_PROJECT_KEY + '/versions', function(err, res, versions) {
            if (err) throw ("ERROR GETTING FIX-VERSIONS ZOMG!!!" + err);
            if (!versions) {
                console.log("wtf no versions in JIRA?", versions);
            } else {
                versions = JSON.parse(versions);
                if (version) {
                    // massage desired version to get "root" version
                    var root_version = version;
                    var version_id = null;
                    if (version.indexOf('r') > -1) {
                        root_version = version.substr(0, version.indexOf('r'));
                    }
                    // find matching version id in JIRA
                    for (var i = 0, l = versions.length; i < l; i++) {
                        var v = versions[i];
                        if (v.name == root_version) {
                            version_id = v.id;
                            break;
                        }
                    }
                    if (!version_id) {
                        // TODO: perhaps have this script create a fixversion in JIRA for this case?
                        console.log('Cannot find version ID number in JIRA related to "root" version string: ' + root_version + '. Maybe you need to create this fixversion in JIRA first? Aborting.');
                        return;
                    }
                    console.log('Creating issues for tagging version "' + version + '", JIRA fixVersion will be "' + root_version + '" (id: ' + version_id + ')...');

                    // fire off parent issue creation
                    parent_issue.fields.fixVersions = [{"id":version_id}];
                    create(parent_issue, function(err, res, body) {
                        if (err) throw ("ERROR!!!" + err);
                        var parent_key = body.key;
                        if (!parent_key) {
                            console.log('No ID retrieved for created parent issue. Aborting.');
                            return;
                        }
                        console.log('Parent issue created.');

                        // 42 is the total number of subtasks currently in a tag parent issue
                        // breakdown:
                        // - tag js
                        // - tag hello world app
                        // - tag mobile-spec
                        // - tag docs
                        // - tag cli
                        // - 12 platforms * 2 tasks (update js, tag) = 24 
                        // - 12 platforms * 1 optional task (update sample app) = 12
                        // - generate source release
                        //   = 42
                        var num_callbacks = 42;
                        if (no_app) num_callbacks -= 11;
                        var end = n(num_callbacks, function() {
                            console.log('All sub-tasks created. JIRA spam complete.');
                        });
                        var subtask_error_check = function(err, res, body) {
                            if (err) {
                                console.error("There was an error creating a subtask :(");
                            } else if (res.statusCode >= 400) {
                                console.error("Got HTTP status " + res.statusCode + " during subtask creation :(");
                                console.log(body);
                            } else end();
                        };

                        create(subtask(parent_key, "Tag Cordova-JS", "Tag JavaScript so that each platform can cut a release.", component_map['CordovaJS'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Tag cordova-cli", "Tag cordova-cli, verify it works with iOS, Android and BlackBerry.", component_map['CLI'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Tag Hello World App", "Tag sample application so that each platform can cut a copy of the application.", component_map['App Hello World'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Update JavaScript for Android", "Update the cordova.js after CordovaJS has been tagged.", component_map['Android'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Update JavaScript for Bada", "Update the cordova.js after CordovaJS has been tagged.", component_map['Bada'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Update JavaScript for BlackBerry", "Update the cordova.js after CordovaJS has been tagged.", component_map['BlackBerry'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Update JavaScript for FirefoxOS", "Update the cordova.js after CordovaJS has been tagged.", component_map['FirefoxOS'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Update JavaScript for iOS", "Update the cordova.js after CordovaJS has been tagged.", component_map['iOS'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Update JavaScript for OS X", "Update the cordova.js after CordovaJS has been tagged.", component_map['OSX'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Update JavaScript for Qt", "Update the cordova.js after CordovaJS has been tagged.", component_map['Qt'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Update JavaScript for Tizen", "Update the cordova.js after CordovaJS has been tagged.", component_map['Tizen'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Update JavaScript for webOS", "Update the cordova.js after CordovaJS has been tagged.", component_map['webOS'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Update JavaScript for WP7", "Update the cordova.js after CordovaJS has been tagged.", component_map['WP7'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Update JavaScript for WP8", "Update the cordova.js after CordovaJS has been tagged.", component_map['WP8'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Update JavaScript for Windows 8", "Update the cordova.js after CordovaJS has been tagged.", component_map['Windows 8'], version_id), subtask_error_check);
                        if (!no_app) {
                            create(subtask(parent_key, "Update www/ Application for Android", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platforms from www/res/icon and www/res/screen.", component_map['Android'], version_id), subtask_error_check);
                            create(subtask(parent_key, "Update www/ Application for Bada", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platforms from www/res/icon and www/res/screen.", component_map['Bada'], version_id), subtask_error_check);
                            create(subtask(parent_key, "Update www/ Application for BlackBerry", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platforms from www/res/icon and www/res/screen.", component_map['BlackBerry'], version_id), subtask_error_check);
                            create(subtask(parent_key, "Update www/ Application for FirefoxOS", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platforms from www/res/icon and www/res/screen.", component_map['FirefoxOS'], version_id), subtask_error_check);
                            create(subtask(parent_key, "Update www/ Application for iOS", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platforms from www/res/icon and www/res/screen.", component_map['iOS'], version_id), subtask_error_check);
                            create(subtask(parent_key, "Update www/ Application for OS X", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platforms from www/res/icon and www/res/screen.", component_map['OSX'], version_id), subtask_error_check);
                            create(subtask(parent_key, "Update www/ Application for Qt", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platforms from www/res/icon and www/res/screen.", component_map['Qt'], version_id), subtask_error_check);
                            create(subtask(parent_key, "Update www/ Application for Tizen", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platforms from www/res/icon and www/res/screen.", component_map['Tizen'], version_id), subtask_error_check);
                            create(subtask(parent_key, "Update www/ Application for webOS", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platforms from www/res/icon and www/res/screen.", component_map['webOS'], version_id), subtask_error_check);
                            create(subtask(parent_key, "Update www/ Application for WP7", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platforms from www/res/icon and www/res/screen.", component_map['WP7'], version_id), subtask_error_check);
                            create(subtask(parent_key, "Update www/ Application for WP8", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platforms from www/res/icon and www/res/screen.", component_map['WP8'], version_id), subtask_error_check);
                            create(subtask(parent_key, "Update www/ Application for Windows 8", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platforms from www/res/icon and www/res/screen.", component_map['Windows 8'], version_id), subtask_error_check);
                        }
                        create(subtask(parent_key, "Tag Android", "After updating the JavaScript and sample application, the release can be tagged.", component_map['Android'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Tag Bada", "After updating the JavaScript and sample application, the release can be tagged.", component_map['Bada'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Tag BlackBerry", "After updating the JavaScript and sample application, the release can be tagged.", component_map['BlackBerry'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Tag FirefoxOS", "After updating the JavaScript and sample application, the release can be tagged.", component_map['FirefoxOS'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Tag iOS", "After updating the JavaScript and sample application, the release can be tagged.", component_map['iOS'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Tag OS X", "After updating the JavaScript and sample application, the release can be tagged.", component_map['OSX'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Tag Qt", "After updating the JavaScript and sample application, the release can be tagged.", component_map['Qt'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Tag Tizen", "After updating the JavaScript and sample application, the release can be tagged.", component_map['Tizen'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Tag webOS", "After updating the JavaScript and sample application, the release can be tagged.", component_map['webOS'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Tag WP7", "After updating the JavaScript and sample application, the release can be tagged.", component_map['WP7'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Tag WP8", "After updating the JavaScript and sample application, the release can be tagged.", component_map['WP8'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Tag Windows 8", "After updating the JavaScript and sample application, the release can be tagged.", component_map['Windows 8'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Tag Docs", "After all platforms have been tagged, the docs can be tagged.", component_map['Docs'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Tag Mobile Spec", "After all platforms have been tagged, mobile-spec can be tagged.", component_map['mobile-spec'], version_id), subtask_error_check);
                        create(subtask(parent_key, "Generate a Source Release", "After all other sub-tasks have been completed, Coho can generate a source release.", component_map['Coho'], version_id), subtask_error_check);
                    });
                } else if (summary) {
                    // find first unreleased version in jira
                    var versionId;
                    for (var i = 0, l = versions.length; i < l; i++) {
                        var v = versions[i];
                        if (v.released == false && v.name != 'Master') {
                            versionId = v.id;
                            break;
                        }
                    }
                    if (versionId) {
                        // fire off parent issue creation
                        parent_issue.fields.fixVersions = [{"id":versionId}];
                        parent_issue.fields.summary = summary;
                        parent_issue.fields.description = description;
                        create(parent_issue, function(err, res, body) {
                            if (err) throw ("ERROR!!!" + err);
                            var parent_key = body.key;
                            if (!parent_key) {
                                console.error('No ID retrieved for created parent issue. Aborting.');
                                console.error(body);
                                return;
                            }
                            console.log('Parent issue created.');

                            // - tag js
                            // - tag mobile-spec
                            // - tag docs
                            // + any platforms
                            if (platforms) {
                                if (platforms[0] == '"') platforms = platforms.substr(1);
                                if (platforms[platforms.length-1] == '"') platforms = platforms.substr(0, platforms.length-1);
                                platforms = platforms.split(',');
                                platforms.forEach(function(p) {
                                    if (platform_labels.indexOf(p) == -1) {
                                        throw new Error('Platform "' + p + '" not recognized!');
                                    }
                                });
                            } else {
                                platforms = ['Android', 'BlackBerry', 'iOS', 'WP7', 'WP8', 'Windows 8', 'OSX']
                            }
                            var num_callbacks = 3 + platforms.length;
                            var end = n(num_callbacks, function() {
                                console.log('All sub-tasks created. JIRA spam complete.');
                            });
                            var subtask_error_check = function(err, res, body) {
                                if (err) {
                                    console.error("There was an error creating a subtask :(");
                                } else if (res.statusCode >= 400) {
                                    console.error("Got HTTP status " + res.statusCode + " during subtask creation :(");
                                    console.log(body);
                                } else end();
                            };

                            create(subtask(parent_key, summary + " [JS]", description, component_map['CordovaJS'], versionId), subtask_error_check);
                            create(subtask(parent_key, summary + " [Tests]", description, component_map['mobile-spec'], versionId), subtask_error_check);
                            create(subtask(parent_key, summary + " [Docs]", description, component_map['Docs'], versionId), subtask_error_check);
                            platforms.forEach(function(p) {
                                var suffix = " [" + p + "]";
                                create(subtask(parent_key, summary + suffix, description, component_map[p], versionId), subtask_error_check);
                            });
                        });
                    } else {
                        console.error('No unreleased version found in JIRA. wtf?');
                    }
                }
            }
        });
    }
});

