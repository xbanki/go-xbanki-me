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

    emits: ['close'],

    inject: ['last_clicked_category'],

    methods: {
        pass_close() { this.$emit('close', false); }
    },

    watch: {
        last_clicked_category(state: { name: string, searching: boolean }) {

            if (this.state.active.id != state.name) {

                const target = this.state.items.find(el => el.id == state.name);

                if (target)
                    this.state.active = target;
            }
        }
    },

    components: {
        'privacy-and-safety-category' : privacyAndSafetyComponent,
        'time-convention-category'    : timeConventionComponent,
        'background-fit-category'     : backgroundFitComponent,
        'date-display-category'       : dateDisplayComponent,
        'time-display-category'       : timeDisplayComponent
    },

    props: {
        data: {
            required: true,
            type: Object,
            default: {},
            validator: (value: any) => (value != undefined && typeof value == 'object')
        }
    }
});