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

            validator(value: any) {
                const discriminator = (discriminatee: any): discriminatee is ComponentState => {

                    if (discriminatee != undefined && typeof discriminatee == 'object') {

                        /**
                         * Runtime "dictionary" of types which to compare against to discriminate type.
                         * @type { [key: string]: any; }
                         */
                        const type_dictionary: { [key: string]: any; } = { critical_only: 'boolean' };

                        if (Object.keys(type_dictionary).length != Object.keys(discriminatee).length) return false;

                        for (const key of Object.keys(discriminatee)) {
                            if (type_dictionary[key] && typeof discriminatee[key] == type_dictionary[key]) continue;

                            return false;
                        }

                        return true;
                    }

                    return false;
                };

                if (discriminator(value)) return true;

                return false;
            }
        }
    }
});