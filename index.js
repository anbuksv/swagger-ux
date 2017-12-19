'use strict'
if (!String.prototype.quote){
    String.prototype.quote = function(){
        return JSON.stringify( this ); 
    }
}

var fs = require('fs');
var routePath = "/api-docs"
var baseDir = __dirname;
var swaggerPath = baseDir + "/index.html";
var redocPath = baseDir + "/redoc.html";
var defaultUI = "swagger";
var validateUrl =  /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
var catchFile = {
    
};

function SwaggerUIException(message) {
   this.message = message;
   this.name = 'SwaggerUIException';
}

exports.route = function (server,options){
    if(typeof(options) !== 'object'){
        throw new SwaggerUIException("options must be type of object");
    }
    
    //options.filePath deprecated
    if((!options.filePath && !options.documentPath) && !options.documentUrl){
        throw new SwaggerUIException("Swagger document absolute path or document url required");
    }

    if(options.documentUrl && !validateUrl.test(options.documentUrl)){
        throw new SwaggerUIException("invalid document url please check the documentUrl field")
    }

    var sendFilePath = (options.filePath || options.documentPath); // options filePath deprecated
    if (!options.documentUrl) {
        if(!fs.existsSync(sendFilePath)){
            throw new SwaggerUIException("Swagger ui config file not found at this path " + sendFilePath);
        }
    }
    
    if(options.routePath){
        routePath = options.routePath;
    }

    try{
        if(options.auth instanceof Function){
            server.get(routePath,options.auth,serveUI); //authentication based route
        }else{
            server.get(routePath,serveUI); //public route
        }
        
        //swagger config file must be public
        //route if documentUrl not defined
        if(!options.documentUrl){
            server.get(routePath + '/swagger',function(req,res,next){
                sendToClient(sendFilePath,res,next);
            });
        }
    }catch(err){
        throw new SwaggerUIException("restify or express server required");
    }

    if(options.defaultUI){
        defaultUI = setDefaultUI(options.defaultUI);
    }
    
    loadHtmlFiles(options);
}

var sendToClient = function(path,res,next){
    fs.readFile(path,'utf8', function(err, file) {
        if (err) {
            console.log(err);
            res.send(500);
            if(next){
                return next();
            }
        }
        res.write(file);
        res.end();
        if(next){
            return next();
        }
    });
}

var serveUI = function(req,res,next){
    var query = req.query.ui;
    var html = (catchFile[query] || catchFile[defaultUI]);
    res.writeHead(200, {
        'Content-Length': Buffer.byteLength(html),
        'Content-Type': 'text/html'
    });
    res.write(html);
    res.end();
}

var loadHtmlFiles = function(options){
    catchFile = {};
    var swaggerFile = fs.readFileSync(swaggerPath, 'utf8');
    var redocFile = fs.readFileSync(redocPath,'utf8');
    catchFile.swagger = template(swaggerFile,options);
    catchFile.redoc = template(redocFile,options);
}

var template = function(string,options){
    string = string.replace('${title}',(options.title || "Documentation"));
    string = string.replace('${documentUrl}',(options.documentUrl ||"./api-docs/swagger").quote());
    string = string.replace('${customStyle}',(options.style || '\n'));
    string = string.replace('${customScript}',(options.script || '\n'));
    //string = string.replace(/\n|\r/g,"");
    return string;
}

var setDefaultUI = function(ui){
    let tempui;
    switch(ui.toLocaleLowerCase()){
        case "redoc":
            tempui = "redoc"
        break;
        case "swagger":
            tempui = "swagger";
        break;
        default:
            tempui = "swagger";
            console.log('\x1b[33m%s\x1b[0m',"Warning Message from swagger-ux : " + ui + " is not valid ui query (default ui will be serve).");
    }
    return tempui;
}
