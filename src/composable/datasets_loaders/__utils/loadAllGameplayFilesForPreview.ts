import { DatasetFile, DatasetFileForPreview } from "@/types/Dataset";
import { dataToPreview } from "@/composable/datasets_loaders/useDatasetsLoader";
import loadEveryGamplayFileName from "@/composable/datasets_loaders/__utils/loadEveryGamplayFileName";
import loadSingleGameplayFile from "@/composable/datasets_loaders/__utils/loadSingleGameplayFile";
import determineGameplaysTimes from "@/composable/datasets_loaders/__utils/determineGameplaysTimes";

export default async (loadAll = false) => {
    dataToPreview.value = [];
    const names: string[] = await loadEveryGamplayFileName();

    for (const fileName of names) {
        const loadedFile: DatasetFile = await loadSingleGameplayFile(fileName);

        if (loadedFile.hide && !loadAll) continue;

        const { words, ...dataForPreview } = loadedFile;
        const { lastModified, createdAt, _rawTimes } = await determineGameplaysTimes(fileName);
        dataToPreview.value.push({
            fileName: fileName,
            wordsAmount: words.length,
            lastModified,
            createdAt,
            _rawTimes,
            // title, description, icon, words:
            words,
            ...dataForPreview,
        });
    }

    const getTime = (target: DatasetFileForPreview) => target._rawTimes.lastModified;
    dataToPreview.value = dataToPreview.value.sort((a, b) => getTime(b) - getTime(a));
};
