# Swagger-UX
swagger-ux allows restify/express to serve the swagger-ui/redoc without hosting expect swagger document and index file.
# What is Swagger-UI?
Swagger UI allows anyone — be it your development team or your end consumers — to visualize and interact with the API’s resources without having any of the implementation logic in place. It’s automatically generated from your Swagger specification, with the visual documentation making it easy for back-end implementation and client-side consumption.
# What is ReDoc?
Redoc is OpenAPI/Swagger-generated API Reference Documentation and it provides a responsive three-panel design with menu/scrolling synchronization.
# Install
`$ npm install --save swagger-ux`
# Usage
**Setup**
``` javascript 
    const SwaggerUX = require('swagger-ux');
    const SwaggerDocumentPath = __dirname + "./swagger.yaml";
    const options = {
        "documentPath": SwaggerDocumentPath
    }
    SwaggerUX.route(server,options); 
```

**Options**

| key|value|required|notes|
|-------|------|-----|----|
| **documentPath** or **documentUrl** | absolute path of the document file or document url` | true | *filePath deprecated|
|title|string|false| html title|
|defaultUI| **enum(** swagger,redoc **)** | false | default ui is swagger|
| routePath     |  document url route path on server |false |default path **/api-docs**|
| auth | middleware function like authentication function |  false | must be instanceof Function|
|script| valid javascript|false|**Example:** *<script>alert('hello world');</script>*|
|style| valid html style tag | false | |


**Open http://<app_host_url>:<app_port>/`api-docs` in your browser to view the documentation.**
# Documentation UI
By default, swagger-ux will serve `swagger-ui (3.6.1)`.
You can switch the user interface of the documentation based on query parameter from the url
- http://<app_host_url>:<port>/`api-docs`?ui=redoc
- http://<app_host_url>:<port>/`api-docs`?ui=swagger
# Requirement
- **[express](https://www.npmjs.com/package/express "Express npm Page")** or **[restify](https://www.npmjs.com/package/restify "Restify npm page")**
