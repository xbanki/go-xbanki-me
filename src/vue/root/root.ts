import { defineComponent } from 'vue';

import backgroundComponent from '@/vue/background/background.vue';
import initComponent       from '@/vue/init/init.vue';

export default defineComponent({

    components: {
        backgroundComponent,
        initComponent
    },

    // Set the application title to "New tab"
    mounted() { this.$nextTick(() => document.title = 'New tab'); }
});