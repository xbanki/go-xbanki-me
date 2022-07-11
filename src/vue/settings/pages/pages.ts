import { defineComponent } from 'vue';

import miscellaneousPageComponent from '@/vue/settings/pages/miscellaneous_pages/miscellaneous.vue';
import dateAndTimePageComponent   from '@/vue/settings/pages/date_and_time_pages/date_and_time.vue';
import appearancePageComponent    from '@/vue/settings/pages/appearance_pages/appearance.vue';

/**
 * Component internal state.
 * @public
 */
export interface ComponentState {

    /**
     * Currently active category.
     * @type {string}
     */
    active_category: string | undefined;
}

export default defineComponent({

    components: {
        'Miscellaneous' : miscellaneousPageComponent,
        'Date & Time'   : dateAndTimePageComponent,
        'Appearance'    : appearancePageComponent
    },

    methods: {
        pass_close() { this.$emit('close', false); }
    },

    emits: ['close'],

    props: {
        state: {
            required: true,
            type: Object,
            default: {},
            validator: (value: any) => (value != undefined && typeof value == 'object')
        }
    }
});