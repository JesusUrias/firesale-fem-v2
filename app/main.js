const fs = require("fs");

const { app, BrowserWindow, dialog, Menu } = require("electron");

let mainWindow = null;

app.on("ready", () => {
  mainWindow = new BrowserWindow({ show: false });

  Menu.setApplicationMenu(applicationMenu);

  mainWindow.loadFile(`${__dirname}/index.html`);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

exports.getFileFromUser = () => {
  const files = dialog.showOpenDialog(mainWindow,{
    properties: ["openFile"],
    buttonLabel: "Unveil",
    title: "Open Fire Sale Document",
    filters: [
      {
        name: "Markdown Files",
        extensions: ["md", "markdown", "mdown", "marcdown"],
      },
      { name: "Text Files", extensions: ["txt", "text"] },
    ],
  });

  if (!files) return;

  const file = files[0];

  openFile(file);
};

exports.saveMarkdown = (file, content) => {
  if (!file) {
    file = dialog.showSaveDialog(mainWindow, {
      title: "Save Markdown",
      defaultPath: app.getPath("desktop"),
      filters: [
        {
          name: "Markdown Files",
          extensions: ["md", "markdown", "mdown", "marcdown"],
        },
      ],
    });
  }

  if (!file) return;

  fs.writeFileSync(file, content);
  openFile(file);
};

exports.saveHtml = (content) => {
  const file = dialog.showSaveDialog(mainWindow, {
    title: "Save HTML",
    defaultPath: app.getPath("desktop"),
    filters: [{ name: "HTML Files", extensions: ["html", "htm"] }],
  });
};

const openFile = (exports.openFile = file => {
  const content = fs.readFileSync(file).toString();
  app.addRecentDocument(file);
  mainWindow.webContents.send("file-opened", file, content);
});

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open File',
        accelerator: 'CommandOrControl+O',
        click() {
          exports.getFileFromUser();
        },
      },
      {
        label: 'Save File',
        accelerator: 'CommandOrControl+S',
        click() {
          mainWindow.webContents.send('save-markdown');
        },
      },
      {
        label: 'Save HTML',
        accelerator: 'CommandOrControl+Shift+S',
        click() {
          mainWindow.webContents.send('save-html');
        },
      },
      {
        label: 'Copy',
        role: 'copy',
      },
    ],
  },
];

if (process.platform === 'darwin') {
  const applicationName = 'Fire Sale';
  template.unshift({
    label: applicationName,
    submenu: [
      {
        label: `About ${applicationName}`,
        role: 'about',
      },
      {
        label: `Quit ${applicationName}`,
        role: 'quit',
      },
    ],
  });
}

const applicationMenu = Menu.buildFromTemplate(template);