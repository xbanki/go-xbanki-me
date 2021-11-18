import { defineComponent } from 'vue';
import { mapState }        from 'vuex';

import { BackgroundDisplayMethod, AvaillableThemes } from '@/lib/store_settings';
import { ModuleState }                               from '@/lib/store_settings';

import initClockComponent from '@/vue/init_clock/init_clock.vue';
import modalComponent     from '@/vue/modal/modal.vue';
import store              from '@/lib/store';

// TO-DO (xbanki): Write a mutex for the image loaded & ready event handler

/**
 * Component data internal description interface.
 */
 interface ComponentData {

    /**
     * Modal opening callback function.
     * @return {void}
     */
    ev?: () => void;

    /**
     * Snapshot of the original state.
     * @type {ComponentState}
     */
     original_state: ComponentState
}

/**
 * Comonent internal state.
 */
 interface ComponentState {

    /**
     * Active background display method.
     * @enum {BackgroundDisplayMethod}
     */
    selected_background_display_method: BackgroundDisplayMethod;

    /**
     * Active application theme.
     * @enum {AvaillableThemes}
     */
    selected_application_theme: AvaillableThemes;
}

export default defineComponent({

    components: {
        initClockComponent,
        modalComponent
    },

    data() {
        const settingsState = store.state as { settingsStore: ModuleState };

        const state: ComponentState = {
            selected_background_display_method: settingsState.settingsStore.background_display_method ?? BackgroundDisplayMethod.FIT,
            selected_application_theme: settingsState.settingsStore.selected_theme ?? AvaillableThemes.LIGHT
        };

        const data: ComponentData = { ev: undefined, original_state: Object.assign({}, state) };

        return { state, data };
    },

    methods: {
        handle_ready_events() {
            if (!this.data.ev || this.settingsStore.initialized) return;
            this.data.ev();
        },

        update_realtime_options() {
            if (this.settingsStore.initialized) return;

            if (this.settingsStore.background_display_method != this.state.selected_background_display_method) {
                store.dispatch('settingsStore/UpdateDisplayMethod', this.state.selected_background_display_method);
            }

            if (this.settingsStore.selected_theme != this.state.selected_application_theme) {
                store.dispatch('settingsStore/SwitchTheme', this.state.selected_application_theme);
            }
        },

        revert_realtime_options() {
            if (this.settingsStore.initialized) return;

            if (this.data.original_state.selected_background_display_method != this.settingsStore.background_display_method) {
                store.dispatch('settingsStore/UpdateDisplayMethod', this.data.original_state.selected_background_display_method);
            }

            if (this.data.original_state.selected_application_theme != this.settingsStore.selected_theme) {
                store.dispatch('settingsStore/SwitchTheme', this.data.original_state.selected_application_theme);
            }
        },

        confirm_init_settings() {
            if (this.settingsStore.ininitialized) return;

            if (this.settingsStore.background_display_method != this.state.selected_background_display_method) {
                store.dispatch('settingsStore/UpdateDisplayMethod', this.state.selected_background_display_method);
            }

            if (this.settingsStore.selected_theme != this.state.selected_application_theme) {
                store.dispatch('settingsStore/SwitchTheme', this.state.selected_application_theme);
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