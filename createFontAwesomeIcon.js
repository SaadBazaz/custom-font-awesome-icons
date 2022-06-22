const fs = require('fs');
const path = require('node:path');
const _ = require('lodash');

// In other environments:
const cheerio = require('cheerio')
var basePrefix = 'fa';
var svgDir = "./svgs";
var resultsDir = "./results";

if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
}

fs.readdirSync(svgDir).forEach(file => {
    //Print file name
    console.log(file);
    var prefix = basePrefix + file[0];
    var subDir = svgDir + "/" + file;

    console.log("prefix:", prefix);
    console.log("subDir:", subDir);

    if (fs.lstatSync(subDir).isDirectory()) {


        var resultsSubDir = resultsDir + "/" + file;

        if (!fs.existsSync(resultsSubDir)) {
            fs.mkdirSync(resultsSubDir);
        }

        console.log("Current file: ", file)

        var libraryName = 'custom-' + file + '-svg-icons';

        var baseUnicode = 'c1a';

        let all_icons= [];

        let svg_files = fs.readdirSync(subDir);
        console.log("svg_files:", svg_files.length);
        for (let i=0; i<svg_files.length; i++) {
            let idx = i;
            let file = svg_files[i];

            let path_to_svg = subDir + "/" + file;
            let extension = path.extname(path_to_svg)

            console.log("file:", file); 
            // console.log("path_to_svg:", path_to_svg); 
            // console.log("extension:", extension); 
            
            if (extension === ".svg") {
                let iconName = path.basename(path_to_svg, extension);
                // console.log("iconName = ", iconName);
                var faCamelCaseIconName = _.camelCase("fa-" + iconName);
                console.log("faCamelCaseIconName = ", faCamelCaseIconName);



                // Actually do the svg manipulation here
                let $;

                let data = fs.readFileSync(path_to_svg, 'utf8')
                
                if (data){
                    // if (err) console.log(err);
                    $ = cheerio.load(data, { xmlMode: true }, false);

                    var svgPath = $('path').attr('d');
                    var viewBox = $('svg').attr('viewBox');

                    // console.log("viewBox: ", viewBox.split(" "))

                    var viewBoxArray = viewBox.split(" ");

                    var width = viewBoxArray[2];
                    var height = viewBoxArray[3];

                    var unicode = baseUnicode+idx;


                    
                    let icon_info = {
                        faCamelCaseIconName: faCamelCaseIconName,
                        iconName: iconName,
                        height: height,
                        width: width,
                        unicode: unicode,
                        svgPath: svgPath,
                    } 

                    // console.log("Icon info:", icon_info);

                    all_icons.push(icon_info)


                    var code = `'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var prefix = '${prefix}';
var iconName = '${iconName}';
var width = ${width};
var height = ${height};
var ligatures = [];
var unicode = '${unicode}';
var svgPathData = '${svgPath}';

exports.definition = {
    prefix: prefix,
    iconName: iconName,
    icon: [
    width,
    height,
    ligatures,
    unicode,
    svgPathData
    ]};

exports.${faCamelCaseIconName} = exports.definition;
exports.prefix = ${prefix};
exports.iconName = iconName;
exports.width = width;
exports.height = height;
exports.ligatures = ligatures;
exports.unicode = unicode;
exports.svgPathData = svgPathData;
    `

                    // console.log("svg:\n", $.html())
                    // console.log("\n\n")
                    // console.log("Code:\n", code);

                    // var dir = resultsDir + "/" + faCamelCaseIconName;

                    // if (!fs.existsSync(dir)){
                    //     fs.mkdirSync(dir);
                    // }

                    // Write output to a file
                    fs.writeFile(resultsSubDir + '/' + faCamelCaseIconName + '.js', code, function (err) {
                       if (err) throw err;
                    });



                }

            }
}

        // Write all icons to an index.js file

        console.log("all_icons.length:", all_icons.length);

        var initial_declarations = [];
        var cache_declarations = [];
        var export_declarations = [];

        for (let i= 0; i < all_icons.length; i++){
            var icon = all_icons[i];            
            
            var { faCamelCaseIconName, iconName, height, width, unicode, svgPath } = icon;
            
            initial_declarations.push(`
var ${faCamelCaseIconName} = {
         prefix: '${prefix}',
         iconName: '${iconName}',
         icon: [${height}, ${width}, [], "${unicode}", "${svgPath}"]
};`)

            cache_declarations.push(`${faCamelCaseIconName}: ${faCamelCaseIconName},`)

            export_declarations.push(`exports.${faCamelCaseIconName} = ${faCamelCaseIconName};`)

            }

            initial_declarations = initial_declarations.join('\n');
            cache_declarations = cache_declarations.join('\n');
            export_declarations = export_declarations.join('\n');

        var code2 = `
/*!
    * Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com
    * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
    */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global['${libraryName}'] = {})));
    }(this, (function (exports) { 'use strict';

    var prefix = "${prefix}";

    ${initial_declarations}

        var _iconsCache = {
        ${cache_declarations}
        }

        exports.${prefix} = _iconsCache;
        exports.prefix = prefix;
        ${export_declarations}

        Object.defineProperty(exports, '__esModule', { value: true });

})));
    `            
              fs.writeFile(resultsSubDir+'/index.js', code2, function (err) {
        if (err) throw err;               console.log('index.js created in ' + resultsSubDir);
      }); 

        }
        /*
    Run this to print the file contents
    console.log(readFileSync(".levels/" + file, {encoding: "utf8"}))
    */

});






//       fs.writeFile(resultsDir+'/index.js', code2, function (err) {
//         if (err) throw err;               console.log('Results Received');
//       }); 


// });

