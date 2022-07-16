import { mapState }        from 'vuex';
import { defineComponent } from 'vue';

import { CategoryTuple }                     from '@/vue/settings/settings';
import { verify_localstorage_availlability } from '@/lib/persistence';

import miscellaneousPageComponent from '@/vue/settings/pages/miscellaneous_pages/miscellaneous.vue';
import dateAndTimePageComponent   from '@/vue/settings/pages/date_and_time_pages/date_and_time.vue';
import appearancePageComponent    from '@/vue/settings/pages/appearance_pages/appearance.vue';
import criticalPageComponent      from '@/vue/settings/pages/critical_pages/critical.vue';
import defaultPageComponent       from '@/vue/settings/pages/default_pages/default.vue';

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

    /**
     * All settings categories.
     * @type {Array<CategoryTuple>}
     */
    categories: CategoryTuple[];
}

export default defineComponent({

    components: {
        'page-miscellaneous' : miscellaneousPageComponent,
        'page-date-and-time' : dateAndTimePageComponent,
        'page-appearance'    : appearancePageComponent,
        'page-critical'      : criticalPageComponent,
        'page-default'       : defaultPageComponent
    },

    mounted() {

        const localstorage_availlable = verify_localstorage_availlability();

        if (localstorage_availlable && !localStorage.getItem(`metadata-${this.__metaData.application_name}`))
            this.state.active_category = 'page-critical';

        else
            this.state.active_category = 'page-default';
    },

    computed: mapState(['__metaData']),

    props: {
        state: {
            required: true,
            type: Object,
            default: {},
            validator: (value: any) => (value != undefined && typeof value == 'object')
        }
    }
});