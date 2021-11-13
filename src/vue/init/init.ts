import { defineComponent } from 'vue';
import { mapState }        from 'vuex';

import { BackgroundDisplayMethod } from '@/lib/store_settings';
import { ModuleState }             from '@/lib/store_settings';

import modalComponent from '@/vue/modal/modal.vue';
import store          from '@/lib/store';

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

/**
 * Comonent internal state.
 */
 interface ComponentState {

    /**
     * Active background display method.
     * @enum {BackgroundDisplayMethod}
     */
    selected_background_display_method: BackgroundDisplayMethod
}

export default defineComponent({

    components: { modalComponent },

    data() {
        const settingsState = store.state as { settingsStore: ModuleState };

        const state: ComponentState = { selected_background_display_method: settingsState.settingsStore.background_display_method ?? BackgroundDisplayMethod.FIT };

        const data: ComponentData = { ev: undefined };

        return { state, data };
    },

    methods: {
        handle_ready_events() {
            if (!this.data.ev || this.settingsStore.initialized) return;

            this.data.ev();
        },

        confirm_init_settings() {
            if (this.settingsStore.ininitialized) {
                return;
            }

            if (this.settingsStore.background_display_method != this.state.selected_background_display_method) {
                store.dispatch('settingsStore/UpdateDisplayMethod', this.state.selected_background_display_method);
            }

            store.dispatch('settingsStore/InitializeUser', true);
        }
    },

    watch: {
        'eventBusStore.has_image_loaded': { handler() { this.handle_ready_events(); }, deep: true },
        'eventBusStore.has_image_load_failed': { handler() { this.handle_ready_events(); }, deep: true }
    },

    computed: mapState(['settingsStore', 'eventBusStore'])
});