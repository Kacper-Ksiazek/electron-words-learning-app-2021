<template>
    <td class="expected">
        <!--  -->
        <!-- PAIR and IMAGE -->
        <!--  -->
        <template v-if="word.modifications.type === 'pair' || word.modifications.type === 'image'">
            <input type="text" v-model.trim="word.modifications.expected" :maxlength="MAX_LENGTH" />
        </template>
        <!--  -->
        <!-- IRREGULAR -->
        <!--  -->
        <template v-else-if="word.modifications.type === 'irregular'">
            <input type="text" v-model.trim="irregulars[0].value" placeholder="First form" :maxlength="MAX_LENGTH" />
            <input type="text" v-model.trim="irregulars[1].value" placeholder="Second form" :maxlength="MAX_LENGTH" />
            <input type="text" v-model.trim="irregulars[2].value" placeholder="Third form" :maxlength="MAX_LENGTH" />
        </template>
    </td>
    <td class="displayed">
        <!--  -->
        <!-- PAIR and IRREGULAR -->
        <!--  -->
        <template v-if="word.modifications.type === 'pair' || word.modifications.type === 'irregular'">
            <input type="text" v-model.trim="word.modifications.displayed" :maxlength="MAX_LENGTH" />
        </template>
        <!--  -->
        <!-- IMAGE -->
        <!--  -->
        <template v-else-if="word.modifications.type === 'image'">
            <template v-if="word.wasOriginallyAnImage() && word._image === null">
                <div class="img" :style="`background-image: url(${defaultImage})`"></div>
            </template>
            <!--  -->
            <template v-else>
                <div class="img" :style="`background-image: url(${word.modifications.displayed})`" v-if="word._image"></div>
                <h5 v-else>Select an image</h5>
            </template>
            <!--  -->
            <div class="button-wrap">
                <button @click="() => $refs.fileInp.click()"><font-awesome-icon icon="cog"></font-awesome-icon></button>
                <button @click="() => (openModal = true)" :disabled="!word._image"><font-awesome-icon icon="eye"></font-awesome-icon></button>
            </div>
            <!--  -->
            <input type="file" @change="handleImageChange" accept="image/*" ref="fileInp" style="display: none" />
        </template>
    </td>
    <td></td>
    <td class="center type">
        <select v-model="word.modifications.type" @change="handleChangeType">
            <option value="pair">PAIR</option>
            <option value="image">IMAGE</option>
            <option value="irregular">IRREGULAR</option>
        </select>
    </td>
    <td></td>
    <td class="center actions">
        <button @click="save" class="save" :disabled="blockSaveButton">Save</button>
        <button @click="discard" class="discard">Discard</button>
    </td>
    <!--  -->
    <!--  -->
    <!--  -->
    <PreviewImage v-if="word.modifications.type === 'image' && openModal" :imageURL="word.modifications.displayed" @exit="() => (openModal = false)"></PreviewImage>
</template>

<script lang="ts">
// Tools
import CurrentWord from "@/classes/CurrentWord";
import _blockSaveButton from "./utils/blockSaveButton";
import _handleChangeType from "./utils/handleChangeType";
import _handleImageChange from "./utils/handleImageChange";
import { defineComponent, PropType, ref, Ref, computed, onMounted, onUnmounted, ComputedRef } from "vue";
// Composable
import useModifier from "@/composable/datasets_manager/useModifier";
import useKeydown from "@/composable/useKeydown";
import { wordsImagePathResolver } from "@/composable/datasets_loaders/useDatasetsLoader";
//
import PreviewImage from "@/components/datasets/manager/single/modify/words/__utils/PreviewImage.vue";

export default defineComponent({
    emits: ["exit-edit-mode"],
    props: {
        word: {
            type: Object as PropType<CurrentWord>,
            required: true,
        },
    },
    components: { PreviewImage },
    setup(props, { emit }) {
        const { datasetToModify, isAnyModalOpened } = useModifier;
        const image = ref<File | null>(null);
        const fileInp = ref<HTMLInputElement | null>(null);
        const openModal = ref<boolean>(false);
        const irregulars: Ref<string>[] = [ref<string>("spit"), ref<string>("spat"), ref<string>("spat")];
        // utils
        const blockSaveButton: ComputedRef<boolean> = _blockSaveButton(props.word, irregulars[0], irregulars[1], irregulars[2]);
        const handleChangeType = _handleChangeType(props.word, fileInp);
        const handleImageChange = _handleImageChange(props.word);

        const MAX_LENGTH = process.env.VUE_APP_MAXIMUM_LENGTH_OF_WORD as unknown as number;
        const save = () => {
            if (blockSaveButton.value) return;
            props.word.displayed = props.word.modifications.displayed;
            props.word.type = props.word.modifications.type;
            // Update expected property
            if (props.word.modifications.type === "irregular") {
                props.word.expected = JSON.stringify(irregulars.map((target) => target.value));
            }
            //
            else props.word.expected = props.word.modifications.expected;
            emit("exit-edit-mode");
        };
        const discard = () => {
            props.word.modifications.expected = props.word.expected;
            props.word.modifications.displayed = props.word.displayed;
            props.word.modifications.type = props.word.type;
            emit("exit-edit-mode");
        };
        const defaultImage = computed<string>(() => {
            const datasetsName = datasetToModify.value?.fileName as string;
            return wordsImagePathResolver(datasetsName, props.word);
        });

        onMounted(() => {
            isAnyModalOpened.value = true;
        });
        onUnmounted(() => {
            isAnyModalOpened.value = false;
        });
        useKeydown([
            {
                key: "Escape",
                fn: () => emit("exit-edit-mode"),
            },
            {
                key: "Enter",
                fn: save,
            },
        ]);

        return { save, discard, blockSaveButton, MAX_LENGTH, image, handleImageChange, handleChangeType, fileInp, openModal, irregulars, defaultImage };
    },
});
</script>
