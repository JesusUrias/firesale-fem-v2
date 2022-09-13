const { app, BrowserWindow } = require('electron');

let mainWindow = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow( { show: false}); // Create the browser window.

    mainWindow.loadFile(`${__dirname}/index.html`); // Load a local HTML file

    mainWindow.once('ready-to-show', () => {
        mainWindow.show(); // Show window when page is ready
    });
});

console.log('starting up');