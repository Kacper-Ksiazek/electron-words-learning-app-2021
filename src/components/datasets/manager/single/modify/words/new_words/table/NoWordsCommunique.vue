<template>
    <span id="there-are-no-new-words" :class="{ 'move-down': !isDatasetJustCreated }">
        <font-awesome-icon icon="globe-europe" class="globe"></font-awesome-icon>
        <h4>There are no new words <span class="color">yet</span></h4>
        <h2>Add some</h2>
        <footer>
            <button @click="triggerImport" :tabindex="tabindex">Import</button>
            <button @click="triggerInscribe" :tabindex="tabindex">Inscribe</button>
        </footer>
    </span>
</template>

<script lang="ts">
// Tools
import { defineComponent, PropType } from "vue";
// Composable
import useModifier from "@/composable/datasets_manager/useModifier";

export default defineComponent({
    props: {
        tabindex: {
            type: Number as PropType<1 | -1>,
            required: true,
        },
    },
    emits: ["open-modal"],
    setup(props, { emit }) {
        const { isDatasetJustCreated } = useModifier;
        const triggerImport = () => {
            document.getElementById("import-new-words-input")?.click();
        };
        const triggerInscribe = () => {
            emit("open-modal");
        };
        //
        return { triggerImport, triggerInscribe, isDatasetJustCreated };
    },
});
</script>
