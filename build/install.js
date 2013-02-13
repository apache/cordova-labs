/**
* Load this script in xpcshell and connect...
*/
const Cc = Components.classes;
const Cu = Components.utils;

Cu.import("resource://gre/modules/devtools/dbg-client.jsm");

var gTransport = null;
var gClient = null;
var gQuit = false;
var gId = null;

function connect(aPort, aHost) {
  gTransport = debuggerSocketConnect(aHost ? aHost : "localhost", aPort);
  gTransport.hooks = {
    onClosed: function() {
      print("Connection closed, quitting.");
      gQuit = true;
    }
  };
  gTransport.ready();
}

try {
  dump("Connecting to install " + arguments[0] + "\n");
  gId = arguments[0];
  let port = arguments[1] || 6000;

  connect(port, "localhost");
  gClient = new DebuggerClient(gTransport);
} catch(ex) {
  dump("Couldn't connect: " + ex + "\n");
  quit(1);
}

function onWebappsEvent(aState, aType, aPacket) {
  if (aType.error) {
    dump("Error: " + aType.message + "\n");
  } else {
    dump("Success!\n");
  }

  gQuit = true;
}

gClient.connect(function onConnected(aType, aTraits) {
  gClient.listTabs(function(aResponse) {
    if (!aResponse.webappsActor) {
      dump("No webapps remote actor!\n");
      gQuit = true;
      return;
    }
    gClient.addListener("webappsEvent", onWebappsEvent);
    gClient.request({ to: aResponse.webappsActor,
                      type: "install",
                      appId: gId,
                      appType: 1
                    },
                    function onResponse(aResponse) {
      if (aResponse.error) {
        dump("Failed to install: " + aResponse.message + "\n");
        gQuit = true;
      } else {
        dump("Installation in progress...\n");
      }
    });
  });
});

let mainThread = Cc["@mozilla.org/thread-manager;1"].getService().mainThread;

while (!gQuit) {
  mainThread.processNextEvent(true);
}
