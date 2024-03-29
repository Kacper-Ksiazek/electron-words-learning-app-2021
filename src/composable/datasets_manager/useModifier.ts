import UseModifier from "@/types/compositions/datasets_manager/_useModifier";
import { ref, computed, watch } from "vue";
import { DatasetFileForPreview } from "@/types/Dataset";
// load submodules
import _useGeneralInformations from "@/composable/datasets_manager/submodules/useGeneralInformations";
import _useWordsManager from "@/composable/datasets_manager/submodules/useWordsManager";
import _useImporting from "@/composable/datasets_manager/submodules/useImporting";
// load utils
import _blockSaveButton from "@/composable/datasets_manager/__utils/blockSaveButton";
import _saveChanges from "@/composable/datasets_manager/__utils/saveChanges";
import _prepareNewDataset from "@/composable/datasets_manager/__utils/prepareNewDataset";
import _deleteDataset from "@/composable/datasets_manager/__utils/deleteDataset";
import _loadDatasetsInfo from "@/composable/datasets_manager/__utils/loadDatasetsInfo";
import _nothingHasBeenChanged from "@/composable/datasets_manager/__utils/nothingHasBeenChanged";
// use submodules
export const useGeneralInformations = _useGeneralInformations;
export const useWordsManager = _useWordsManager;
export const useImporting = _useImporting;
// use utils
export const blockSaveButton = _blockSaveButton;
export const saveChanges = _saveChanges;
export const prepareNewDataset = _prepareNewDataset;
export const deleteDataset = _deleteDataset;
export const loadDatasetsInfo = _loadDatasetsInfo;
export const nothingHasBeenChanged = _nothingHasBeenChanged;
// general properites
export const datasetToModify = ref<DatasetFileForPreview | null>(null);
export const extendCurrentWordsSection = ref<boolean>(false);
export const loadExtendedContent = ref<boolean>(false);
export const isDatasetJustCreated = computed<boolean>(() => !!datasetToModify.value?._justCreated);
export const displayExitModal = ref<boolean>(false);
export const isAnyModalOpened = ref<boolean>(false);
//
watch(
    datasetToModify,
    (val) => {
        useWordsManager.resetWordsManagerData(!!val?._justCreated);
        useGeneralInformations.initValues(val);
        displayExitModal.value = false;
        isAnyModalOpened.value = false;
        extendCurrentWordsSection.value = false;
        loadExtendedContent.value = false;
    },
    { deep: true }
);
watch(extendCurrentWordsSection, (val) => {
    setTimeout(() => {
        loadExtendedContent.value = val;
    }, 500);
});
//
//
//
export default {
    // Submodules:
    useGeneralInformations,
    useWordsManager,
    useImporting,
    // Properties:
    datasetToModify,
    extendCurrentWordsSection,
    loadExtendedContent,
    blockSaveButton,
    isDatasetJustCreated,
    displayExitModal,
    nothingHasBeenChanged,
    isAnyModalOpened,
    // methods SYNC:
    prepareNewDataset,
    // methods ASYNC:
    saveChanges,
    deleteDataset,
    loadDatasetsInfo,
} as UseModifier;
