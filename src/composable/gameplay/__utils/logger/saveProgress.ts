import path from "path";
import fse from "fs-extra";
import { gameplayDataFile } from "@/composable/gameplay/main";
import { progressLog } from "@/composable/gameplay/logger";
import computeProgressPoints from "@/composable/gameplay/__utils/logger/ComputeProgressPoints";
import determineCrucialWords from "@/composable/gameplay/__utils/logger/DetermineCrucialWords";
import { progressLogsDirPath } from "@/composable/paths";
import ProgressLogFile from "@/types/logger/ProgressLogFile";

//
//
export default async () => {
    const { answers, start, number_of_draws } = progressLog.value;
    const { invalid, valid, rescued } = answers;
    const newLogFilename = `${Date.now()}_log`;
    const p = path.join(progressLogsDirPath, gameplayDataFile.value.fileName, newLogFilename + ".json");

    const points = await computeProgressPoints();
    const crucialWords = await determineCrucialWords(points);
    await fse.writeJson(p, {
        "accuracy[%]": ((valid.length + rescued.length * 0.75) / (invalid.length + valid.length + rescued.length)).toFixed(2) as unknown as number,
        number_of_draws,
        answers: {
            invalid: answers.invalid,
            valid: answers.valid,
            rescued: answers.rescued,
        },
        session: {
            date: start.UTC,
            "duration[s]": (Date.now() - start.raw) / 1000,
        },
        points,
        crucial_words: {
            words_made_mastered: crucialWords.words_made_mastered,
            words_made_strong: crucialWords.words_made_strong,
            words_made_weak: crucialWords.words_made_weak,
            words_removed_from_strong: crucialWords.words_removed_from_strong,
            words_removed_from_weak: crucialWords.words_removed_from_weak,
        },
    } as ProgressLogFile);
    return newLogFilename;
};
