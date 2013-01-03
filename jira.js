var request = require('request');
var n       = require('ncallbacks');
var _       = require('underscore');
var argv    = require('optimist').argv;

var version = argv.version;
var username = argv.username;
var password = argv.password;

if (!version || !username || !password) {
    console.log("Usage: node jira.js --version=<version> --username=<username> --password=<password>");
    console.log("Example: node jira.js --version=2.3.0rc2 --username=fil --password=poop");
    return;
}

var JIRA_PROJECT_KEY = "CB";
var API_URL = "https://issues.apache.org/jira/rest/api/latest/";

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

                    // 38 is the total number of subtasks currently in a tag parent issue
                    // breakdown:
                    // - tag js
                    // - tag hello world app
                    // - tag mobile-spec
                    // - tag docs
                    // - 11 platforms * 3 tasks (update js, update sample app, tag) = 33
                    // - generate source release
                    //   = 38
                    var end = n(38, function() {
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
                    create(subtask(parent_key, "Tag Hello World App", "Tag sample application so that each platform can cut a copy of the application.", component_map['App Hello World'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update JavaScript for Android", "Update the cordova.js after CordovaJS has been tagged.", component_map['Android'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update JavaScript for Bada", "Update the cordova.js after CordovaJS has been tagged.", component_map['Bada'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update JavaScript for BlackBerry", "Update the cordova.js after CordovaJS has been tagged.", component_map['BlackBerry'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update JavaScript for iOS", "Update the cordova.js after CordovaJS has been tagged.", component_map['iOS'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update JavaScript for Mac", "Update the cordova.js after CordovaJS has been tagged.", component_map['Mac'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update JavaScript for Qt", "Update the cordova.js after CordovaJS has been tagged.", component_map['Qt'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update JavaScript for Tizen", "Update the cordova.js after CordovaJS has been tagged.", component_map['Tizen'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update JavaScript for webOS", "Update the cordova.js after CordovaJS has been tagged.", component_map['webOS'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update JavaScript for WP7", "Update the cordova.js after CordovaJS has been tagged.", component_map['WP7'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update JavaScript for WP8", "Update the cordova.js after CordovaJS has been tagged.", component_map['WP8'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update JavaScript for Windows 8", "Update the cordova.js after CordovaJS has been tagged.", component_map['Windows 8'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update www/ Application for Android", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platfroms from www/res/icon and www/res/screen.", component_map['Android'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update www/ Application for Bada", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platfroms from www/res/icon and www/res/screen.", component_map['Bada'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update www/ Application for BlackBerry", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platfroms from www/res/icon and www/res/screen.", component_map['BlackBerry'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update www/ Application for iOS", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platfroms from www/res/icon and www/res/screen.", component_map['iOS'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update www/ Application for Mac", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platfroms from www/res/icon and www/res/screen.", component_map['Mac'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update www/ Application for Qt", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platfroms from www/res/icon and www/res/screen.", component_map['Qt'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update www/ Application for Tizen", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platfroms from www/res/icon and www/res/screen.", component_map['Tizen'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update www/ Application for webOS", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platfroms from www/res/icon and www/res/screen.", component_map['webOS'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update www/ Application for WP7", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platfroms from www/res/icon and www/res/screen.", component_map['WP7'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update www/ Application for WP8", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platfroms from www/res/icon and www/res/screen.", component_map['WP8'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Update www/ Application for Windows 8", "Update the www/ sample application after App-Hello-World has been tagged. IMPORTANT: Remove irrelevant platfroms from www/res/icon and www/res/screen.", component_map['Windows 8'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Tag Android", "After updating the JavaScript and sample application, the release can be tagged.", component_map['Android'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Tag Bada", "After updating the JavaScript and sample application, the release can be tagged.", component_map['Bada'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Tag BlackBerry", "After updating the JavaScript and sample application, the release can be tagged.", component_map['BlackBerry'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Tag iOS", "After updating the JavaScript and sample application, the release can be tagged.", component_map['iOS'], version_id), subtask_error_check);
                    create(subtask(parent_key, "Tag Mac", "After updating the JavaScript and sample application, the release can be tagged.", component_map['Mac'], version_id), subtask_error_check);
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
            }
        });
    }
});

