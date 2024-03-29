import { ref } from "vue";
import WordDraw from "@/types/WordDraw";
import Word from "@/types/Word";
import { DatasetFileForPreview, LatestAnswerMessage } from "@/types/Dataset";
import { loadData } from "@/composable/gameplay/useData";
import { resetLog, saveLog } from "@/composable/gameplay/useLogger";
import UseMain from "@/types/compositions/gameplay/_useMain";
// load utils
import _drawNewWord from "@/composable/gameplay/__utils/gameplay/drawRandomWord";
import _processAnswer from "@/composable/gameplay/__utils/gameplay/processUsersAnswer";
// use utils
export const proccessAnswer = _processAnswer;
// properites
export const draw = ref<WordDraw>({} as WordDraw);
export const usersAnswer = ref<string[]>([""]);
export const answersResult = ref<LatestAnswerMessage>(null);
export const remainingRedemptionAttemptsNumber = ref<number>(0);
export const latestInvalidWord = ref<Word | null>(null);
export const gameplayDataFile = ref<DatasetFileForPreview>({} as DatasetFileForPreview);
// methods
export const drawNewWord = () => _drawNewWord();
//
export const __resetUsersAnswer = () => (usersAnswer.value = [""]);
export const startNewGamplay = async () => {
    remainingRedemptionAttemptsNumber.value = 0;
    answersResult.value = null;
    resetLog();
    await loadData();
    drawNewWord();
    __resetUsersAnswer();
};
//
export const endGamplay = async () => {
    await saveLog();
    __resetUsersAnswer();
};
//
//
//
export default {
    // Properties
    draw,
    usersAnswer,
    drawNewWord,
    answersResult,
    gameplayDataFile,
    latestInvalidWord,
    // methods SYNC:
    remainingRedemptionAttemptsNumber,
    proccessAnswer,
    // methods ASYNC:
    endGamplay,
    startNewGamplay,
} as UseMain;
