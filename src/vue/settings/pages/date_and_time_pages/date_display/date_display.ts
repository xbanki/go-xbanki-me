import { Store, mapState } from 'vuex';
import { defineComponent } from 'vue';

import { ModuleState, FormatDelimiter, FormatToken } from '@/lib/store_settings';

import store from '@/lib/store';

/**
 * Active format state.
 */
interface ComponentStateFormat {

    /**
     * Active time display delimiter.
     * @enum {FormatDelimiter}
     */
    delimiter: FormatDelimiter;

    /**
     * Currently active format.
     * @type {Array<FormatToken>}
     */
    active: FormatToken[];

    /**
     * Inactive format tokens.
     * @type {Array<FormatToken>}
     */
    inactive: FormatToken[];
}

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Active format data.
     * @type {ComponentStateFormat}
     */
    format: ComponentStateFormat;
}

export default defineComponent({

    data() {
        const typed_store = store as Store<{ settingsStore: ModuleState }>;

        // Format object state

        const delimiter = typed_store.state.settingsStore.date_delimiter;

        const inactive = typed_store.state.settingsStore.date_format_inactive;

        const active = typed_store.state.settingsStore.date_format_active;

        const format: ComponentStateFormat = {
            delimiter,
            inactive,
            active
        };

        const state: ComponentState = {
            format
        };

        return { state };
    },

    methods: {
        update_delimiter() {

            if (this.state.format.delimiter != this.settingsStore.time_delimiter) {

                store.commit('settingsStore/UPDATE_DATE_FORMAT_DELIMITER', this.state.format.delimiter);

                this.update_active_format();
            }
        },

        update_active_format() { store.dispatch('settingsStore/SetDateFormat', [this.state.format.active, this.state.format.inactive]); }
    },

    computed: mapState(['settingsStore'])
});