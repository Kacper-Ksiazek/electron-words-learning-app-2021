<template>
    <button @click="handleClick" :disabled="disableButton" class="extend-compress">{{ buttonText }}</button>
</template>

<script lang="ts">
// Tools
import { defineComponent, ref, computed } from "vue";
// Composable
import useKeydown from "@/composable/useKeydown";
import useModifier from "@/composable/datasets_manager/useModifier";

export default defineComponent({
    setup() {
        const { extendCurrentWordsSection } = useModifier;
        const disableButton = ref<boolean>(false);
        const handleClick = () => {
            extendCurrentWordsSection.value = !extendCurrentWordsSection.value;
            disableButton.value = true;

            setTimeout(() => {
                disableButton.value = false;
            }, 1000);
        };
        const buttonText = computed<"Extend" | "Compress">(() => {
            return extendCurrentWordsSection.value ? "Compress" : "Extend";
        });

        useKeydown([
            {
                key: "e",
                fn: handleClick,
                ctrl: true,
            },
        ]);

        return { handleClick, disableButton, buttonText };
    },
});
</script>
