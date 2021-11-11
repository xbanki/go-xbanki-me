import { defineComponent } from 'vue';

import backgroundComponent from '@/vue/background/background.vue';
import store               from '@/lib/store';

export default defineComponent({

    components: { backgroundComponent },

    // Set the application title to "New tab"
    mounted() { this.$nextTick(() => document.title = 'New tab'); },

    methods: {
        debug_stretch() { store.dispatch('settingsStore/UpdateDisplayMethod', 'METHOD_STRETCH'); },
        debug_fill() { store.dispatch('settingsStore/UpdateDisplayMethod', 'METHOD_FILL'); },
        debug_fit() { store.dispatch('settingsStore/UpdateDisplayMethod', 'METHOD_FIT'); }
    }
});