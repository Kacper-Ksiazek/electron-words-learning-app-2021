<template>
    <span id="drag-file-here" @dragover.prevent @drop.stop.prevent="importOnDragAndDrop">
        <font-awesome-icon icon="file-upload"></font-awesome-icon>
        <h1>Drop file here</h1>
    </span>
</template>

<script lang="ts">
// Tools
import { defineComponent } from "vue";
// Components
import useModifier from "@/composable/datasets_manager/useModifier";

export default defineComponent({
    setup() {
        const { importOnDragAndDrop } = useModifier.useImporting;
        return { importOnDragAndDrop };
    },
});
</script>
