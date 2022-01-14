import { defineComponent } from 'vue';

/**
 * Component internal state.
 * @public
 */
export interface ComponentState {

    /**
     * Displays "critical" category options, which will only be active
     * if we are in initialization mode.
     * @type {boolean}
     */
    critical_only: boolean;
}

export default defineComponent({

    props: {
        state: {
            required: true,
            type: Object,
            validator: (value) => (value != undefined && typeof value == 'object')
        }
    }
});