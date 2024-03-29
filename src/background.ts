import { app, protocol, BrowserWindow, ipcMain, Rectangle } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import ElectronStore from "@/ElectronStore";

const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { secure: true, standard: true } }]);

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        title: "Nauka jezyka",
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: true,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            webSecurity: process.env.NODE_ENV !== "production",
        },
    });

    if (ElectronStore.get("fullscreen")) win.setFullScreen(true);
    //
    // Resizing
    //
    try {
        const bounds: Rectangle = ElectronStore.get("bounds") as Rectangle;
        bounds.height = bounds.height - 70;
        win.setContentBounds(bounds);
    } catch (_: unknown) {
        win.maximize();
    }
    const handleResize = () => {
        ElectronStore.set("bounds", win.getBounds());
    };
    win.on("resized", handleResize);
    win.on("moved", handleResize);

    if (process.env.NODE_ENV === "production") win.removeMenu();

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
        if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol("app");
        // Load the index.html when not in development
        win.loadURL("app://./index.html");
    }
    ipcMain.handle("fullscreen", () => {
        const t = !win.isFullScreen();
        win.setFullScreen(t);
        ElectronStore.set("fullscreen", t);
    });
}

ipcMain.handle("quit-app", () => {
    app.quit();
});
// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS);
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            console.error("Vue Devtools failed to install:", (e as any).toString());
        }
    }
    createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === "win32") {
        process.on("message", (data) => {
            if (data === "graceful-exit") {
                app.quit();
            }
        });
    } else {
        process.on("SIGTERM", () => {
            app.quit();
        });
    }
}
