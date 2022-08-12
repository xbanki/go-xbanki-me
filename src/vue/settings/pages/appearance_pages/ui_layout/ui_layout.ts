import { Store, mapState } from 'vuex';
import { defineComponent } from 'vue';

import get_initial_positions from '@/lib/get_canvas_positions';

import { ModuleState as CanvasComponentState } from '@/lib/store_component_canvas';
import { ModuleState as EventBusState }        from '@/lib/store_event_bus';
import { CanvasItemData }                      from '@/lib/store_settings';

import store from '@/lib/store';

/**
 * Reset UI layout button labels.
 */
enum ResetLabels {
    DEFAULT = 'Reset UI Layout',
    CONFIRM = 'Confirm?'
}

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

    /**
     * Reset button display label.
     * @enum {ResetLabels}
     */
    label: ResetLabels;
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


        const defaults: Record<string, CanvasItemData> = {
            'clock-component': { x: -1, y: -1, width: 320, height: 64 },
            'date-component' : { x: -2, y: -2, width: 320, height: 18 }
        };

        // Disable state constants

        const label = ResetLabels.DEFAULT;

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
            disable,
            label
        };

        return { state, data };
    },

    methods: {

        handle_click_edit() {

            store.commit('componentSettingsStore/UPDATE_RENDER_STATE', false);

            this.$nextTick(() => store.commit('componentCanvasStore/UPDATE_EDIT_MODE', true));
        },

        handle_click_reset() {

            if (this.state.label == ResetLabels.DEFAULT)
                this.state.label = ResetLabels.CONFIRM;

            else if (this.state.label == ResetLabels.CONFIRM) {

                for (const name of Object.keys(this.data.defaults)) {

                    const current: CanvasItemData = this.settingsStore.canvas_items[name];
                    const target = this.data.defaults[name];

                    // Reset the component to defaults before applying correct positioning
                    store.dispatch('settingsStore/UpdateCanvasItem', { name, data: { height: target.height, width: target.width, x: target.x, y: target.y } });

                    const height = target.height;
                    const width  = target.width;

                    const y = get_initial_positions(target.y, name, false);
                    const x = get_initial_positions(target.x, name, true);

                    console.log(name, target.x,  x, target.y, y);

                    const data: CanvasItemData = { height, width, x, y };

                    if (data != current)
                        store.dispatch('settingsStore/UpdateCanvasItem', { name, data });
                }

                this.state.label = ResetLabels.DEFAULT;
            }
        }
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