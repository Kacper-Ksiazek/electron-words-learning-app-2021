<template>
    <section id="new-letter-form">
        <input type="text" id="new-fancy-letter" placeholder="Enter new letter" maxlength="1" v-model="newFancyLetter" ref="ref_input" :disabled="fancyLetters.length === 6" :tabindex="tabindex" />
        <button :disabled="!newLetterIsEmpty || fancyLetters.length === 6" @click="handleAddNewLetter" id="button" :tabindex="tabindex">Add</button>
    </section>
</template>

<script lang="ts">
// Tools
import { defineComponent, ref, computed, PropType } from "vue";
// Composable
import useKeydown from "@/composable/useKeydown";
import useGeneralInformations from "@/composable/datasets_manager/submodules/useGeneralInformations";
//
export default defineComponent({
    props: {
        tabindex: {
            type: Number as PropType<1 | -1>,
            required: true,
        },
    },
    setup() {
        const { fancyLetters } = useGeneralInformations;

        const newFancyLetter = ref<string>("");
        const ref_input = ref<HTMLButtonElement | null>(null);
        const newLetterIsEmpty = computed<boolean>(() => newFancyLetter.value.length > 0);

        const handleAddNewLetter = () => {
            if (newLetterIsEmpty.value && fancyLetters.value.length < 6) {
                fancyLetters.value.push(newFancyLetter.value);
                newFancyLetter.value = "";
            }
        };

        useKeydown([
            {
                key: "Enter",
                fn: () => {
                    if (ref_input.value === document.activeElement) {
                        handleAddNewLetter();
                    }
                },
            },
        ]);

        return { newFancyLetter, handleAddNewLetter, newLetterIsEmpty, ref_input, fancyLetters };
    },
});
</script>
