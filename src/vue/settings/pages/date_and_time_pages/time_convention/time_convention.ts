import { Store, mapState } from 'vuex';
import { defineComponent } from 'vue';

import { ClockConvention, ModuleState, FormatToken } from '@/lib/store_settings';

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

                // Denotes wether or not the meridem token is in active format.
                let meridem_index: number | undefined;

                for (const target of this.settingsStore.time_format_active as FormatToken[]) if (target?.token == 'a') {

                    meridem_index = this.settingsStore.time_format_active.indexOf(target);

                    break;
                }

                // Handle format update
                if (meridem_index != undefined) {

                    const inactive: FormatToken[] = this.settingsStore.time_format_inactive;
                    const active:   FormatToken[] = this.settingsStore.time_format_active;

                    active[meridem_index] = Object.assign(active[meridem_index], { disabled: this.state.selected_clock_convention == ClockConvention.EUROPEAN ? true : false });

                    store.dispatch('settingsStore/SetTimeFormat', [active, inactive]);
                }

                store.commit('settingsStore/SET_CLOCK_CONVENTION', this.state.selected_clock_convention);
            }
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