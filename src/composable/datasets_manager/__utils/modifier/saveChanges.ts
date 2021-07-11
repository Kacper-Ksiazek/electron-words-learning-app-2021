// libraries
import path from "path";
import fse from "fs-extra";
// types
import { GameplayDataFile } from "@/types/Gameplay";
import Word, { ArchivedWord } from "@/types/Word";
// properties
import { dataToPreview } from "@/composable/datasets_manager/useLoader";
import { dataDirPath, iconsPath, archivePath } from "@/composable/paths";
import { datasetToModify, datasetWords, previewModifySection } from "@/composable/datasets_manager/useModifier";
import { title, description, fancyLetters, iconName, customIcon } from "@/composable/datasets_manager/useModifier-submodules/useGeneralInformations";
import { wordsToDelete, newWords } from "@/composable/datasets_manager/useModifier-submodules/useWordsManager";

class SaveChanges {
    protected dataToSave: GameplayDataFile = {} as GameplayDataFile;
    protected deletedWords: ArchivedWord[] = [];
    protected currentDate = "";

    constructor() {
        this.currentDate = new Date().toLocaleString();
        this.dataToSave = {
            description: description.value,
            title: title.value,
            fancyLetters: fancyLetters.value,
            words: datasetWords.value as Word[],
            icon: iconName.value,
        };
    }

    protected generateWords() {
        // remove words
        wordsToDelete.value.forEach((word: Word) => {
            const index = this.dataToSave.words.findIndex((target: Word) => {
                return target.displayed === word.displayed && target.expected === word.expected;
            });
            this.deletedWords.push({
                ...this.dataToSave.words[index],
                archivedAt: this.currentDate,
            });

            this.dataToSave.words.splice(index, 1);
        });
        // add words
        this.dataToSave.words = [...this.dataToSave.words, ...newWords.value];
    }

    protected async tackleCustomIcon() {
        if (customIcon.value instanceof File) {
            const { name } = customIcon.value;
            await fse.copy(customIcon.value.path, path.join(iconsPath, name));
            this.dataToSave.icon = name;
        }
    }

    protected async archiveDeletedWords() {
        const p = path.join(archivePath, datasetToModify.value?.fileName + ".json");
        let currentArchive: ArchivedWord[] = [];
        try {
            currentArchive = (await fse.readJSON(p)) as ArchivedWord[];
        } catch (_: unknown) {
            //
        }
        await fse.writeJson(p, [...currentArchive, ...this.deletedWords]);
    }

    protected updateDataToPreview() {
        const index = dataToPreview.value.findIndex((target) => {
            return target.fileName === datasetToModify.value?.fileName;
        });

        dataToPreview.value[index] = {
            ...this.dataToSave,
            fileName: datasetToModify.value?.fileName as string,
            wordsAmount: this.dataToSave.words.length,
            lastModified: this.currentDate,
        };

        previewModifySection.value = false;
    }

    protected async save() {
        const p = path.join(dataDirPath, datasetToModify.value?.fileName + ".json");
        await fse.writeJSON(p, this.dataToSave);
    }

    async main() {
        this.generateWords();
        await this.tackleCustomIcon();
        await this.archiveDeletedWords();
        await this.save();
        this.updateDataToPreview();
    }
}

export default async () => {
    await new SaveChanges().main();
};