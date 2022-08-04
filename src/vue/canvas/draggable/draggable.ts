import { mapState, Store } from 'vuex';
import { defineComponent } from 'vue';

import { ModuleState } from '@/lib/store_component_canvas';

import store from '@/lib/store';

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Denotes wether or not this component is scaleable.
     * @type {boolean}
     */
    scaleable: boolean;

    /**
     * Denotes wether or not we are in edit mode.
     * @type {boolean}
     */
    edit: boolean;
}

export default defineComponent({

    data() {

        const typed_store = store as Store<{ componentCanvasStore: ModuleState }>;

        const scaleable = typeof this.$props.scaleable == 'boolean' ? this.$props.scaleable : true;

        const edit = typed_store.state.componentCanvasStore.edit;

        // Assembled state object

        const state: ComponentState = {
            scaleable,
            edit
        };

        return { state };
    },

    watch: {
        'componentCanvasStore.edit'(state: boolean) { this.state.edit = state; }
    },

    props: ['scaleable'],

    computed: mapState(['componentCanvasStore'])
});