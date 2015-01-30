Crosswalk-app-tools
===================

Command line tools to create and package Crosswalk applications. The license for this project is Apache License
Version 2.0, please refer to the LICENSE-APACHE-V2 included with the package.

Crosswalk-app-tools is in very early stages of development, and not suitable for use in a production environment. "Releases" and announcements are made available as a technology preview only. No packages are being published at this time, but git tags serve as reference points for release milestones.

### Preparation

Mac OS X is the only tested platform. Node.js, the Xcode command line tools, the Xcode iOS SDK 8.1, and git must be functional.

1. Download: `git clone https://github.com/takethathe/crosswalk-app-tools.git`
2. Checkout the iOS version: `git checkout ios`
2. Install dependencies: `cd crosswalk-app-tools`, then `npm install`, and `cd ..`
3. The main script is `crosswalk-app-tools/bin/crosswalk-app`. Set environment PATH or invoke with directory.

### Usage

`crosswalk-app create com.example.Foo`: This
sets up a skeleton project in directory com.example.Foo/, imports Crosswalk iOS AppShell from template, and puts a sample "hello world" web app under com.example.Foo/www/.

`cd com.example.Foo`: move to the project root.

Then, you can put your XPK web application resources in com.example.Foo/www.

`crosswalk-app build`: Build the web app, The package Foo.ipa will end up under Build/.

That's all for now. More to come soon, and if all goes well, NPMs for new years.

### Notice

This is a very simple package tool prototype for iOS Crosswalk, and is planning to merge into [Crosswalk App tools](https://github.com/crosswalk-project/crosswalk-app-tools.git).
