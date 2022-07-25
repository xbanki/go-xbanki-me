import { defineComponent } from 'vue';

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

        const scaleable = typeof this.$props.scaleable == 'boolean' ? this.$props.scaleable : true;

        // @TODO(xbanki): In the future, gather the state from event bus store
        const edit = true;

        // Assembled state object

        const state: ComponentState = {
            scaleable,
            edit
        };

        return { state };
    },

    props: ['scaleable']
});