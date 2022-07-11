import { Store, mapState } from 'vuex';
import { defineComponent } from 'vue';

import { ClockConvention, ModuleState } from '@/lib/store_settings';

import store from '@/lib/store';

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Active clock display convention.
     * @type {ClockConvention}
     */
    selected_clock_convention: ClockConvention;
}

export default defineComponent({

    data() {
        const typed_store = store as Store<{ settingsStore: ModuleState }>;

        const selected_clock_convention = typed_store.state.settingsStore.time_convention;

        const state: ComponentState = { selected_clock_convention };

        return { state };
    },

    methods: {
        update() {
            if (this.settingsStore.time_convention != this.state.selected_clock_convention) {
                store.commit('settingsStore/SET_CLOCK_CONVENTION', this.state.selected_clock_convention);
            }
        }
    },

    computed: mapState(['settingsStore'])
});