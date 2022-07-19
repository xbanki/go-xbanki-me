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
    method: BackgroundDisplayMethod;
}

export default defineComponent({

    data() {
        const typed_store = store as Store<{ settingsStore: ModuleState }>;

        const method = typed_store.state.settingsStore.background_display_method;

        const state: ComponentState = { method };

        return { state };
    },

    methods: {

        /**
         * Updates selected background fit with internal state.
         */
        update() {
            if (this.settingsStore.background_display_method != this.state.method)
                store.dispatch('settingsStore/UpdateDisplayMethod', this.state.method);

        }
    },

    computed: mapState(['settingsStore']),

    props: {
        standalone: {
            type: Boolean,
            required: false,
            default: false
        }
    }
});