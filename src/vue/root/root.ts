import { defineComponent } from 'vue';

export default defineComponent({

    // Set the application title to "New tab"
    mounted() { this.$nextTick(() => document.title = 'New tab'); }
});