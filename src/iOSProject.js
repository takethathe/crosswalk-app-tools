var Shell = require ("shelljs");
var Fs = require ('fs');
var Path = require ('path');
var Xcode = require ('xcode');
var appParser = require('app-parser');
var Console = require('./Console.js');

function checkParameters(project_dir, project_name) {
    if (project_name == "" || project_name == null) {
        console.log("Please provide the project name.");
        return false;
    }

    if (Shell.test('-d', project_dir)) {
        console.log("The project has been already existed.");
        return false;
    }
    return true;
}

function create(template_dir, project_dir, project_name) {
    if (!checkParameters(project_dir, project_name))
        return;
    Shell.cp('-Rf', template_dir, Shell.pwd());
    Shell.mv('AppShell', project_dir);
    Shell.pushd(project_dir);
    Shell.ls (".").filter (function (file) {
        Shell.mv (file, file.replace (/AppShell/gi, project_name));
    });
    var xcodeproj = project_name+".xcodeproj";
    Shell.find (xcodeproj).filter (function (file) {
        if (Shell.test ('-f', file)) {
            Shell.sed ('-i', /AppShell/gi, project_name, file);
            Shell.mv('-f', file, file.replace (/AppShell/gi, project_name));
        }
    });

    // Replace package name in info.plist.
    var info_file = Path.join(project_dir, project_name, 'Info.plist');
    var project_name_prefix = Path.basename(project_dir, '.' + project_name);
    if (Shell.test('-f', info_file)) {
        Shell.sed('-i', /org.crosswalk-project/gi, project_name_prefix, info_file);
    }
    Shell.popd();
}

function build(project_dir, project_name) {
    if (project_name == "" || project_name == null) {
        console.log("Please provide the project name.");
        return;
    }

    Console.log('Start to update the web resources.');
    Shell.pushd(project_dir);
    var project_path = Path.join(project_dir, project_name + '.xcodeproj', 'project.pbxproj');
    var project = Xcode.project(project_path);
    var Manifest = require(Path.join(project_dir, 'www', 'manifest.json'));
    project.parse(function (err) {
        Fs.writeFileSync(Path.join(project_dir, 'www', 'manifest.plist'), require('plist').build(Manifest));
        // Add the real resource files.
        Shell.pushd(Path.join(project_dir, 'www'));
        // Remove the default resource files first.
        project.removeResourceFile('index.html');
        project.removeResourceFile('icon.png');
        Shell.find('.').filter(function (file) {
            if (Shell.test('-f', file)) {
                project.addResourceFile(file);
            }
        });
        Shell.popd();

        Fs.writeFileSync(project_path, project.writeSync());
        Console.log('Finished update resources.');
        var iosParser = appParser.iosParser;
        var proj_path = iosParser.getProjectPath(project_dir);
        var build_path = Path.join(project_dir, 'Build');
        Shell.mkdir('-p', build_path);
        var ipa_path = Path.join(build_path, project_name + '.ipa');
        var app_path = Path.join(build_path, project_name + '.app');
        Console.log('Start to build ipa file.');
        require('ipa-build')(proj_path, ipa_path, build_path, project_name, app_path);
        Console.log('Finished, look at the ' + ipa_path);
    });
    Shell.popd();
}

module.exports = {
    'create': create,
    'build': build
};
