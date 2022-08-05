import { Store, mapState } from 'vuex';
import { defineComponent } from 'vue';

import { ModuleState } from '@/lib/store_event_bus';

import store from '@/lib/store';

/**
 * Disabled state data.
 */
interface ComponentStateDisabled {

    /**
     * Disables the 'Edit UI Layout' button.
     * @type {boolean}
     */
    edit: boolean;

    /**
     * Disables resetting UI layout.
     * @type {boolean}
     */
    reset: boolean;
}

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Button disable state.
     * @type {ComponentStateDisabled}
     */
    disable: ComponentStateDisabled;
}

export default defineComponent({

    data() {

        const typed_store = store as Store<{ eventBusStore: ModuleState }>;

        // Disable state constants

        // @TODO(xbanki): We should get this if layout has been marked dirty
        const reset = true;

        const edit = typed_store.state.eventBusStore.supports_data_persistence;

        // Final state objects

        const disable: ComponentStateDisabled = {
            reset,
            edit
        };

        const state: ComponentState = {
            disable
        };

        return { state };
    },

    methods: {

        handle_click_edit() { this; },

        handle_click_reset() { this; }
    },

    watch: {
        'eventBusStore.supports_data_persistence'(state: boolean) { this.state.disable.edit = state; }
    },

    computed: mapState(['eventBusStore'])
});