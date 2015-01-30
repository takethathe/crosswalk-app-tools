var Shell = require ("shelljs");
var Fs = require ('fs');
var Path = require ('path');
var iOSProject = require('./iOSProject.js');
var CommandParser = require("./CommandParser.js");

function main() {
    var parser = new CommandParser(process.argv);
    var cmd = parser.getCommand();
    if (cmd) {
        switch(cmd){
        case 'create':
            var tool_dir = Path.join(Fs.realpathSync(Path.dirname(process.argv[1])), '..');
            var template_dir = Path.join(tool_dir, 'data/AppShell');
            var packageId = parser.createGetPackageId();
            var parts = packageId.split('.');
            var project_name = parts[parts.length-1];
            var project_dir = Path.join(Shell.pwd(), packageId);
            iOSProject.create(template_dir, project_dir, project_name);
            break;
        case 'build':
            var project_dir = Shell.pwd();
            var parts = Path.basename(project_dir).split('.');
            var project_name = parts[parts.length-1];
            iOSProject.build(project_dir, project_name);
            break;
        default:
        };
    } else {
        console.log("Command error!");
    }
}

module.exports = {
    'main': main,
};
