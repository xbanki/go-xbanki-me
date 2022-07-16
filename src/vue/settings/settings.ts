import { mapState }                  from 'vuex';
import { defineComponent, computed } from 'vue';

import { ComponentData as CategoriesData, CategoryItem, CategoryParent } from '@/vue/settings/categories/categories';
import { ComponentState as PagesState }                                  from '@/vue/settings/pages/pages';
import { verify_localstorage_availlability }                             from '@/lib/persistence';

import categoriesComponent from '@/vue/settings/categories/categories.vue';
import pagesComponent      from '@/vue/settings/pages/pages.vue';
import modalComponent      from '@/vue/modal/modal.vue';
import store               from '@/lib/store';

import { version } from '~/package.json';

/**
 * Helper type to reduce code duplication.
 */
export type CategoryTuple = [CategoryParent, CategoryItem[]];

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Categories sub-component data.
     */
    categories_data: CategoriesData;

    /**
     * Pages sub-component state.
     * @type {PagesState}
     */
    pages_state: PagesState;

    /**
     * Only true if the categories bar is searching.
     * @type {boolean}
     */
    is_searching: boolean;
}

export default defineComponent({

    data() {

        const appearance_category: CategoryTuple = [
            {
                filtered: false,
                id: 'page-appearance',
                name: 'Appearance'
            },
            [
                {
                    name: 'Theme',
                    critical: false,
                    id: 'theme-category',
                    keywords: [
                        'automatic',
                        'darkmode',
                        'lightmode'
                    ]
                },
                {
                    name: 'Background Fit',
                    critical: true,
                    id: 'background-fit-category',
                    keywords: [
                        'bg',
                        'critical',
                        'fill',
                        'fit',
                        'stretch',
                        'image'
                    ]
                }
            ]
        ];

        const date_time_category: CategoryTuple = [
            {
                filtered: false,
                id: 'page-date-and-time',
                name: 'Date & Time'
            },
            [
                {
                    name: 'Time Convention',
                    critical: true,
                    id: 'time-convention-category',
                    keywords: [
                        'clock',
                        'critical'
                    ]
                },
                {
                    name: 'Time Display',
                    critical: true,
                    id: 'time-display-category',
                    keywords: [
                        'clock format',
                        'critical',
                        'time format'
                    ]
                },
                {
                    name: 'Date Display',
                    critical: true,
                    id: 'date-display-category',
                    keywords: [
                        'day',
                        'day format',
                        'date format',
                        'critical'
                    ]
                }
            ]
        ];

        const miscellaneous_category: CategoryTuple = [
            {
                filtered: false,
                id: 'page-miscellaneous',
                name: 'Miscellaneous'
            },
            [
                {
                    name: 'Changelog',
                    critical: false,
                    id: 'changelog-category',
                    keywords: [
                        'changes'
                    ]
                },
                {
                    name: 'Privacy & Safety',
                    critical: true,
                    id: 'privacy-and-safety-category',
                    keywords: [
                        'eula',
                        'licenses'
                    ]
                },
                {
                    name: 'Delete Data',
                    critical: false,
                    id: 'delete-data-category',
                    keywords: [
                        'remove',
                        'rm',
                        'save'
                    ]
                }
            ]
        ];

        const items: CategoryTuple[] = [appearance_category, date_time_category, miscellaneous_category];

        const categories_data: CategoriesData = { version,  items };

        const pages_state: PagesState = { active_category: undefined, categories: items };

        const state: ComponentState = {
            is_searching: false,
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

        /**
         * Discriminates wether or not this app has been launched before, which
         * we use for launching the settings component automatically.
         */
        discriminate_component_state(): boolean {

            const localstorage_availlable = verify_localstorage_availlability();

            if (localstorage_availlable && !localStorage.getItem(`metadata-${this.__metaData.application_name}`)) {

                store.commit('eventBusStore/UPDATE_CRITICAL_ONLY', true);

                return false;
            }

            else {

                store.commit('eventBusStore/UPDATE_CRITICAL_ONLY', false);

                return true;
            }
        },

        handle_category_clicked(source: CategoryItem, search?: boolean) {

            for (const [parent, contents] of this.state.categories_data.items) {

                // Search through parent category children for a match
                const target_search = contents.includes(source);

                if (this.state.pages_state.active_category != parent.id && target_search) {

                    store.commit('eventBusStore/UPDATE_LAST_CLICKED_CATEGORY', source.id);

                    if (this.eventBusStore.critical_only)
                        this.state.pages_state.active_category = parent.id;

                    break;
                }

                else if (this.state.pages_state.active_category == parent.id && target_search) {

                    store.commit('eventBusStore/UPDATE_LAST_CLICKED_CATEGORY', source.id);

                    break;
                }
            }
        },

        handle_parent_clicked(source: { category: CategoryParent, search?: string }) {

            for (const [parent, items] of this.state.categories_data.items) {

                if (parent.id.toLocaleLowerCase().trim().includes(source.category.id.trim().toLocaleLowerCase())) {

                    if (source.search) {

                        const predicate = (el: CategoryItem): boolean => {

                            const target = el.name.trim().toLowerCase();
                            const search = source.search?.trim().toLowerCase() ?? '';

                            let found = false;

                            if (source.search) if (target.includes(search))
                                found = true;

                            for (const keyword of el.keywords) {

                                if (target.includes(keyword.trim().toLowerCase())) {

                                    found = true;

                                    break;
                                }
                            }

                            return found;
                        };

                        const target = items.find(predicate);

                        if (target)
                            this.handle_category_clicked(target, true);

                        else
                            this.state.pages_state.active_category = parent.id;
                    }

                    else
                        this.state.pages_state.active_category = source.category.id;

                    break;
                }
            }
        },

        handle_settings_open() {

            // We discriminate to set critical only flags
            this.discriminate_component_state();

            this.$nextTick(() => store.commit('eventBusStore/UPDATE_SETTINGS_RENDER_STATE', true));
        }
    },

    watch: {
        'eventBusStore'(state: boolean) { if (!state) store.commit('eventBusStore/UPDATE_LAST_CLICKED_CATEGORY', undefined); }
    },

    computed: mapState(['eventBusStore', '__metaData'])
});