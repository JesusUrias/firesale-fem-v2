const fs = require('fs');
const { app, BrowserWindow, dialog } = require("electron");

let mainWindow = null;

app.on("ready", () => {
  mainWindow = new BrowserWindow({ show: false });

  mainWindow.loadFile(`${__dirname}/index.html`);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

exports.getFileFromUser = () => {
  const files = dialog.showOpenDialog({
    properties: ["openFile"],
    buttonLabel: 'Unveil',
    title: 'Open Fire Sale Document',
    filters: [
      { 
        name: 'Markdown Files', 
        extensions: ['md', 'markdown', 'mdown', 'marcdown'] },
      { name: 'Text Files', 
      extensions: ['txt', 'text'] },
    ]
  });

  if (!files) return;

  const file = files[0];
  const content = fs.readFileSync(file).toString;

  console.log(content);
};
