import { mapState, Store } from 'vuex';
import { defineComponent } from 'vue';

import { AvaillableThemes, ModuleState } from '@/lib/store_settings';

import store from '@/lib/store';

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Currently active application theme.
     * @enum {AvaillableThemes}
     */
    selected_application_theme: AvaillableThemes;
}

/**
 * Component data internal description interface.
 */
interface ComponentData {

    /**
     * Denotes if this section is critical or not.
     * @type {boolean}
     */
    is_critical: boolean;
}

export default defineComponent({
    data() {
        const typed_store = store as Store<{ settingsStore: ModuleState }>;

        const selected_application_theme = typed_store.state.settingsStore.selected_theme;

        const state: ComponentState = { selected_application_theme };

        const data: ComponentData = { is_critical: false };

        return { state, data };
    },

    methods: {
        update() {
            if (this.settingsStore.selected_theme != this.state.selected_application_theme) {
                store.dispatch('settingsStore/SwitchTheme', this.state.selected_application_theme);
            }
        }
    },

    inject: ['critical_only'],

    computed: mapState(['settingsStore'])
});