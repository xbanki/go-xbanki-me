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
    theme: AvaillableThemes;
}

export default defineComponent({
    data() {
        const typed_store = store as Store<{ settingsStore: ModuleState }>;

        const theme = typed_store.state.settingsStore.selected_theme;

        const state: ComponentState = { theme };

        return { state };
    },

    methods: {

        /**
         * Updates selected theme with internal state.
         */
        update() {
            if (this.settingsStore.selected_theme != this.state.theme) {
                store.dispatch('settingsStore/SwitchTheme', this.state.theme);
            }
        }
    },

    computed: mapState(['settingsStore'])
});