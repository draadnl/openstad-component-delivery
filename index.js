const express = require('express');
const fs      = require("fs");
const app     = express()
const cors    = require("cors");
const port    = 3030

app.use(cors());

app.get('/component/:componentId', (req, res) => {
  
  
  const componentId = req.params.componentId;
  const randomId    = Math.floor(Math.random() * 1000000);
  
  // Todo: Fetch component from database
  
  // Todo: Fetch component configuration
  
  // Todo: Fetch component javascript
  const componentJs = './components_dist/ideas-overview.js';
  
  // Todo: Fetch component css
  const componentCss = './components_dist/css/ideas-overview_minified.css';
  
  // Combine component configuration, javascript and css w/ React if necessary
  const reactJs    = './react_dist/react@17.0.2.production.min.js';
  const reactDomJs = './react_dist/react-dom@17.0.2.production.min.js';
  
  let output = "";
  
  [reactJs, reactDomJs, componentJs].forEach((file) => {
    output += fs.readFileSync(file, 'utf8');
  });
  
  let css = fs.readFileSync(componentCss, 'utf8');
  
  css = css.replaceAll('url(../images/', `url(http://localhost:${port}/components_dist/images/`);
  
  const componentClass = `osc-component-${componentId}-${randomId}`;
  
  // Create function to render component
  output += `
    const currentScript = document.currentScript;
    window.addEventListener('load', function (e) {
      currentScript.insertAdjacentHTML('afterend', \`<div class="${componentClass}"></div>\`);
      
      document.querySelector('head').innerHTML += \`<style>${css}</style>\`;
      
      const params = new Proxy(new URLSearchParams(window.location.search), {get: (searchParams, prop) => searchParams.get(prop)});
      
      let config   = {
        "title": "Plannen", "display": {"columns": 2}, "id": "test12", "divId": "${componentId}", "user": {"fullName": "Hardcoded Username", "role": "admin"}, "api": {"isUserLoggedIn": true, "url": "https://api.openstad.nlsvgtr.nl", "headers": {"X-Authorization": '123'}}, "siteId": 416, "editIdeaLink": "javascript: alert('Hier moet dus een zinnige link staan')", "afterDeleteIdeaLink": "javascript: alert('Hier moet dus een zinnige link staan')", image: {allowMultipleImages: true,}, vote: {isViewable: true, isActive: true, requiredUserRole: "anonymous", voteType: "likes", voteValues: [{label: "voor", value: "yes"}, {label: "tegen", value: "no"}]},
      };
      
      let element  = document.querySelector('.${componentClass}');
      OpenStadComponents['ideas-overview'].IdeasOverview.renderElement(element, config);
      
      currentScript.remove();
    });
  `;
  
  res.header("Content-Type", "application/javascript");
  
  res.send(output);
});

app.use('/components_dist', express.static(__dirname + '/components_dist'));

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
});
