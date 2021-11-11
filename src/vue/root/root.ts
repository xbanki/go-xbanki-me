import { defineComponent } from 'vue';

import backgroundComponent from '@/vue/background/background.vue';

export default defineComponent({

    components: { backgroundComponent },

    // Set the application title to "New tab"
    mounted() { this.$nextTick(() => document.title = 'New tab'); }
});