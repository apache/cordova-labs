# build script for Apache Cordova Firefox OS

PORT_DEVICE = 6000
PORT_LOCAL = 6000
XPCSHELL ?= ~/Documents/mozilla/mozilla-central/obj-x86_64-apple-darwin11.4.2/dist/bin/xpcshell
ADB ?= adb
FOLDER = framework
VERSION := $(shell cat VERSION)



all :: packaged install

copy_js:
	cp lib/cordova.firefoxos.js framework/cordova-$(VERSION).js

package: copy_js
	cd ./${FOLDER} && zip -X ./application.zip ./* -x application.zip

packaged: package
	${ADB} push ./${FOLDER}/application.zip /data/local/tmp/b2g/${FOLDER}/application.zip

install:
	${ADB} forward tcp:$(PORT_LOCAL) tcp:$(PORT_DEVICE)
	@echo "Please confirm the remote debugging prompt on the phone!"
	${XPCSHELL} build/install.js ${FOLDER} $(PORT_LOCAL)
