'use strict'

var fs = require('fs');

function SwaggerUIException(message) {
   this.message = message;
   this.name = 'SwaggerUIException';
}

exports.route = function (server,options){
    if(typeof(options) !== 'object'){
        throw new SwaggerUIException("options must be type of object");
    }
    
    var sendFilePath = options.filePath;
    if (!fs.existsSync(sendFilePath)) {
        throw new SwaggerUIException("Swagger ui config file not found at this path " + sendFilePath);
    }
    
    var routePath = (options.routePath) ? options.routePath : '/api-docs'; //update the swagger ui route path
    try{
        if(options.auth instanceof Function){
            server.get(routePath,options.auth,serveUI); //authentication based route
        }else{
            server.get(routePath,serveUI); //public route
        }
        //swagger config file must be public
        server.get(routePath + '/swagger',function(req,res,next){
            sendToClient(sendFilePath,res,next);
        });
    }catch(err){
        throw new SwaggerUIException("restify or express server required");
    }
}

var serveUI = function(req,res,next){
    var ui = req.query.ui;
    var send = './index.html';
    switch(ui){
        case "redoc":
            send = './redoc.html'
        break;
        case "swagger":
            send = './index.html';
        break;
    };
    var sendFile = __dirname + "/" + send; // index and redoc html files sent by swagger-ui-express-restify
    sendToClient(sendFile,res,next);
}

var sendToClient = function(path,res,next){
    fs.readFile(path,'utf8', function(err, file) {
        if (err) {
            console.log(err);
            res.send(500);
            return next();
        }
        res.write(file);
        res.end();
        if(next){
            return next();
        }
    });
}
