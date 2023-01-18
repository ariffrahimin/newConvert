const execSync = require('child_process').execSync;
const fs = require("fs")

// Using the OSX tool, convert the SGM file into XML file with a limit of 1000000 warnings.
// The warnings are results of no equivalent notation of SGML in XML and will be resolved after.
const convert = (filepath, outputpath) => {
    const output = execSync(`osx --xml-output-option=lower --max-errors=1000000 ${filepath} > ${outputpath}`, { encoding: 'utf-8' });
    console.log('Output was:\n', output);
}

// Read the SGM file and parse it into a string.
const reader = (filepath) =>{

    return new Promise((resolve) => {
    fs.readFile(filepath, (err, data) => {
        if (err) throw err;
        var content = data.toString();
        resolve(content);
      });    
    });
}

// The String will be concated with a DTD reference if there is none in the file.
const saver = async (filepath, outputpath, filename) =>{
    const x = await reader(filepath)  
    const reference = `<!DOCTYPE ${filename} SYSTEM "${filename}.DTD">`
    const regex = new RegExp(reference);
    const testRegex = regex.test(x)
    if (testRegex == false){
       const topleveled = reference.concat("\n",x)
        fs.writeFile(filepath, topleveled, err =>{
            if(err){
                console.err;
                return;
            }
        });
        setTimeout(()=> {
            convert(filepath,outputpath);
        }, 4000); 
    }
    else if(testRegex == true){
        setTimeout(()=> {
            convert(filepath,outputpath);
        }, 4000);
    }
    else{
        console.error('error the tesRegex result is', testRegex );
    }

    
}

const main = () => {
    var filepath = "SGML/TSM.SGM"; // The Path of the SGML
    var outputpath = "output/TSM.XML"; //The Path of the output xml file
    var filename = "TSM"; // The name of the file
    saver(filepath, outputpath, filename)
}

main()