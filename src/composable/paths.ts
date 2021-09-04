import fse from "fs-extra";
import path from "path";

const CONSTANT_DIR_NAME = "jezyki";

export const dataDirPath = ((): string => {
    if (process.env.NODE_ENV === "production") return path.join("..", CONSTANT_DIR_NAME, "datasets");
    else return (process.env.VUE_APP_DEFAULT_DATA_DIR_PATH as string) || "./src/data";
})();

export const archivePath = ((): string => {
    console.log(path.resolve("./src/logs/archive"));
    if (process.env.NODE_ENV === "production") return path.join("..", CONSTANT_DIR_NAME, "logs/archive");
    else return "./src/logs/archive";
})();

export const progressLogsDirPath = ((): string => {
    if (process.env.NODE_ENV === "production") return path.join("..", CONSTANT_DIR_NAME, "logs/progress");
    else return (process.env.VUE_APP_DEFAULT_PROGRESS_LOGS_DIR_PATH as string) || "./src/logs/progress";
})();

export const crucialWordsDirPath = ((): string => {
    if (process.env.NODE_ENV === "production") return path.join("..", CONSTANT_DIR_NAME, "logs/crucial_words");
    else return (process.env.VUE_APP_DEFAULT_CRUCIAL_WORDS_DIR_PATH as string) || "./src/logs/crucial_words";
})();

export const iconsPath = ((): string => {
    if (process.env.NODE_ENV === "production") return path.join("..", CONSTANT_DIR_NAME, "images");
    else return (process.env.VUE_APP_DEFAULT_CRUCIAL_WORDS_DIR_PATH as string) || "./public/images/gameplay_icons";
})();

export const ensurePaths = async () => {
    await fse.ensureDir(dataDirPath);
    await fse.ensureDir(archivePath);
    await fse.ensureDir(progressLogsDirPath);
    await fse.ensureDir(crucialWordsDirPath);
    await fse.ensureDir(iconsPath);
};
