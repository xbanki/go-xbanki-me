import { mapState }        from 'vuex';
import { defineComponent } from 'vue';

import { CategoryItem }  from '@/vue/settings/categories/categories';
import { CategoryTuple } from '@/vue/settings/settings';

import privacyAndSafetyComponent from '@/vue/settings/pages/miscellaneous_pages/cookie_usage/cookie_usage.vue';
import timeConventionComponent   from '@/vue/settings/pages/date_and_time_pages/time_convention/time_convention.vue';
import backgroundFitComponent    from '@/vue/settings/pages/appearance_pages/background_fit/background_fit.vue';
import dateDisplayComponent      from '@/vue/settings/pages/date_and_time_pages/date_display/date_display.vue';
import timeDisplayComponent      from '@/vue/settings/pages/date_and_time_pages/time_display/time_display.vue';

/**
 * Internal component state.
 */
interface ComponentState {

    /**
     * Currently active critical setting's ID.
     * @type {string}
     */
    active: CategoryItem;

    /**
     * Filtered (critical only) array of category items.
     * @type {CategoryItem}
     */
    items: CategoryItem[];
}

/**
 * Component public data.
 */
export interface ComponentData {

    /**
     * All category data.
     * @type {Array<CategoryTuple>}
     */
    categories: CategoryTuple[];
}

export default defineComponent({

    components: {
        'privacy-and-safety-category' : privacyAndSafetyComponent,
        'time-convention-category'    : timeConventionComponent,
        'background-fit-category'     : backgroundFitComponent,
        'date-display-category'       : dateDisplayComponent,
        'time-display-category'       : timeDisplayComponent
    },

    data() {

        const typed_data = this.$props.data as ComponentData;

        const items: CategoryItem[] = [];

        for (const category of typed_data.categories)
            category[1].forEach(el => el.critical ? items.push(el) : false);

        const active: CategoryItem = items[0];

        // Assembled state object

        const state: ComponentState = {
            active,
            items
        };

        return { state };
    },

    watch: {
        'componentSettingsStore.last_clicked_category'(state?: string) {

            if (state && this.state.active.id != state) {

                const target = this.state.items.find(el => el.id == state);

                if (target)
                    this.state.active = target;
            }
        }
    },

    computed: mapState(['componentSettingsStore']),

    props: {
        data: {
            required: true,
            type: Object,
            default: {},
            validator: (value: any) => (value != undefined && typeof value == 'object')
        }
    }
});