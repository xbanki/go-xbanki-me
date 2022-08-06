import { Store, mapState } from 'vuex';
import { defineComponent } from 'vue';

import { ModuleState as CanvasComponentState } from '@/lib/store_component_canvas';
import { ModuleState as EventBusState }        from '@/lib/store_event_bus';
import { CanvasItemData }                      from '@/lib/store_settings';

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

/**
 * Internal component data.
 */
interface ComponentData {

    /**
     * Default canvas items states.
     * @type {Record<string, CanvasItemData>}
     */
    defaults: Record<string, CanvasItemData>;
}

export default defineComponent({

    data() {

        const typed_store = store as Store<{ eventBusStore: EventBusState, componentCanvasStore: CanvasComponentState }>;

        // Data constants

        // @TODO(xbanki): Replace this with actual good defaults.
        const defaults: Record<string, CanvasItemData> = { };

        // Disable state constants

        const reset = typed_store.state.componentCanvasStore.dirty;

        const edit = !(typed_store.state.eventBusStore.supports_data_persistence);

        // Final state objects

        const disable: ComponentStateDisabled = {
            reset,
            edit
        };

        const data: ComponentData = {
            defaults
        };

        const state: ComponentState = {
            disable
        };

        return { state, data };
    },

    methods: {

        handle_click_edit() {

            store.commit('componentSettingsStore/UPDATE_RENDER_STATE', false);

            this.$nextTick(() => store.commit('componentCanvasStore/UPDATE_EDIT_MODE', true));
        },

        handle_click_reset() { this; }
    },

    watch: {
        'eventBusStore.supports_data_persistence'(state: boolean) { this.state.disable.edit = state; },

        'settingsStore.canvas_items': {

            handler(state: Record<string, CanvasItemData>) {

                if (state != this.data.defaults)
                    this.$nextTick(
                        () => {
                            store.commit('componentCanvasStore/MARK_CANVAS_DIRTY', true);

                            this.state.disable.reset = false;
                        }
                    );
            },

            immediate: true
        }
    },

    computed: mapState(['settingsStore', 'eventBusStore', 'componentCanvasStore'])
});