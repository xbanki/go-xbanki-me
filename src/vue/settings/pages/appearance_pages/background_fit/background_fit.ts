import { Store, mapState } from 'vuex';
import { defineComponent } from 'vue';

import { BackgroundDisplayMethod, ModuleState } from '@/lib/store_settings';

import store from '@/lib/store';

/**
 * Comonent internal state.
 */
 interface ComponentState {

    /**
     * Active background display method.
     * @enum {BackgroundDisplayMethod}
     */
    selected_background_display_method: BackgroundDisplayMethod;
}

export default defineComponent({

    data() {
        const typed_store = store as Store<{ settingsStore: ModuleState }>;

        const selected_background_display_method = typed_store.state.settingsStore.background_display_method;

        const state: ComponentState = { selected_background_display_method };

        return { state };
    },

    methods: {
        update() {
            if (this.settingsStore.background_display_method != this.state.selected_background_display_method) {
                store.dispatch('settingsStore/UpdateDisplayMethod', this.state.selected_background_display_method);
            }
        }
    },

    computed: mapState(['settingsStore'])
});