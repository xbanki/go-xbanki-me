import { defineComponent } from 'vue';
import { mapState }        from 'vuex';

import modalComponent from '@/vue/modal/modal.vue';

/**
 * Component data internal description interface.
 */
 interface ComponentData {

    /**
     * Modal opening callback function.
     * @return {void}
     */
    ev?: () => void;
}

export default defineComponent({

    components: { modalComponent },

    data() {

        const data: ComponentData = { ev: undefined };

        return { data };
    },

    methods: {
        handle_ready_events() {
            if (!this.data.ev || this.settingsStore.initialized) return;

            this.data.ev();
        }
    },

    watch: {
        'eventBusStore.has_image_loaded': { handler() { this.handle_ready_events(); }, deep: true },
        'eventBusStore.has_image_load_failed': { handler() { this.handle_ready_events(); }, deep: true }
    },

    computed: mapState(['settingsStore', 'eventBusStore'])
});