import { defineComponent } from 'vue';

/**
 * Comonent internal state.
 */
interface ComponentState { }

/**
 * Component data internal description interface.
 */
interface ComponentData { }

export default defineComponent({

    data() {

        // Final state & data objects

        const state: ComponentState = { };

        return { state };
    },

    mounted() { },

    methods: { }
});