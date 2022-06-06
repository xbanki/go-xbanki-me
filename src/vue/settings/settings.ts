import { mapState }                  from 'vuex';
import { defineComponent, computed } from 'vue';

import { ComponentState as CategoriesState, ComponentData as CategoriesData, CategoryItem } from '@/vue/settings/categories/categories';
import { ComponentState as PagesState }                                                     from '@/vue/settings/pages/pages';
import { verify_localstorage_availlability }                                                from '@/lib/persistence';

import categoriesComponent from '@/vue/settings/categories/categories.vue';
import pagesComponent      from '@/vue/settings/pages/pages.vue';
import modalComponent      from '@/vue/modal/modal.vue';

import { version } from '~/package.json';

/**
 * Helper type to reduce code duplication.
 */
type CategoryTuple = [string, CategoryItem[]];

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Changes display state between initialization & full settings.
     * @enum {STATE_INIT | STATE_SETTINGS}
     */
    component_display_state: 'STATE_INIT' | 'STATE_SETTINGS';

    /**
     * Categories sub-component state.
     */
    categories_state: CategoriesState;

    /**
     * Categories sub-component data.
     */
    categories_data: CategoriesData;

    /**
     * Pages sub-component state.
     */
    pages_state: PagesState;

    /**
     * Displays or hides the settings component.
     */
    render_state: boolean;
}

export default defineComponent({

    data() {

        const categories_state: CategoriesState = {
            critical_only: false
        };

        const appearance_category: CategoryTuple = [
            'Appearance',
            [
                {
                    name: 'Theme',
                    critical: false,
                    id: 'theme-category'
                },
                {
                    name: 'Background Fit',
                    critical: true,
                    id: 'background-fit-category'
                }
            ]
        ];

        const date_time_category: CategoryTuple = [
            'Date & Time',
            [
                {
                    name: 'Time Convention',
                    critical: true,
                    id: 'time-convention-category'
                },
                {
                    name: 'Date Display',
                    critical: true,
                    id: 'date-display-category'
                },
                {
                    name: 'Time Display',
                    critical: true,
                    id: 'time-display-category'
                }
            ]
        ];

        const miscellaneous_category: CategoryTuple = [
            'Miscellaneous',
            [
                {
                    name: 'Changelog',
                    critical: false,
                    id: 'changelog-category'
                },
                {
                    name: 'Privacy & Safety',
                    critical: false,
                    id: 'privacy-and-safety-category'
                },
                {
                    name: 'Delete Data',
                    critical: false,
                    id: 'delete-data-category'
                }
            ]
        ];

        const items: CategoryTuple[] = [appearance_category, date_time_category, miscellaneous_category];

        const categories_data: CategoriesData = { version,  items };

        const pages_state: PagesState = { active_category: undefined };

        const state: ComponentState = {
            component_display_state: 'STATE_SETTINGS',
            render_state: false,
            categories_state,
            categories_data,
            pages_state
        };

        return { state };
    },

    components: {
        categoriesComponent,
        modalComponent,
        pagesComponent
    },

    mounted() { this.$nextTick(() => this.discriminate_component_state()); },

    methods: {
        discriminate_component_state() {
            const localstorage_availlable = verify_localstorage_availlability();

            if (localstorage_availlable && !localStorage.getItem(`metadata-${this.__metaData.application_name}`)) {
                this.state.component_display_state = 'STATE_INIT';
                this.state.render_state = true;

                return;
            }
        },

        handle_category_clicked(source: CategoryItem) {
            let target_match_name: string | undefined = undefined;

            for (const [name, contents] of this.state.categories_data.items) {

                // Search through parent category children for a match
                const target_search = contents.find((el) => el.id == source.id);

                if (target_search != undefined) {
                    target_match_name = name;

                    break;
                }
            }

            if (typeof target_match_name == 'string' && this.state.pages_state.active_category != target_match_name) this.state.pages_state.active_category = target_match_name;
        },

        handle_render_state_change(state: boolean) { if (state != this.state.render_state) this.state.render_state = state; }
    },

    provide() { return { critical_only: computed(() => this.state.categories_state.critical_only) }; },

    computed: mapState(['eventBusStore', '__metaData'])
});