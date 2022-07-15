import { mapState }                  from 'vuex';
import { defineComponent, computed } from 'vue';

import { ComponentState as CategoriesState, ComponentData as CategoriesData, CategoryItem, CategoryParent } from '@/vue/settings/categories/categories';
import { ComponentState as PagesState }                                                                     from '@/vue/settings/pages/pages';
import { verify_localstorage_availlability }                                                                from '@/lib/persistence';

import categoriesComponent from '@/vue/settings/categories/categories.vue';
import pagesComponent      from '@/vue/settings/pages/pages.vue';
import modalComponent      from '@/vue/modal/modal.vue';

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

    /**
     * Last clicked category item.
     */
    last_clicked_category?: { name: string, search?: boolean };

    /**
     * Array containing critical only mode IDs.
     */
    critical_categories: string[];

    /**
     * Only true if the categories bar is searching.
     * @type {boolean}
     */
    is_searching: boolean;
}

export default defineComponent({

    data() {

        const categories_state: CategoriesState = {
            critical_only: false
        };

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

        const critical_categories: string[] = [];

        // Populate IDs
        [...appearance_category[1], ...date_time_category[1], ...miscellaneous_category[1]].forEach(el => el.critical ? critical_categories.push(el.id) : false);

        const state: ComponentState = {
            component_display_state: 'STATE_INIT',
            is_searching: false,
            render_state: false,
            critical_categories,
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
                this.state.categories_state.critical_only = true;
                this.state.render_state = true;
            }

            else {
                this.state.component_display_state = 'STATE_SETTINGS';
                this.state.categories_state.critical_only = false;
            }
        },

        handle_category_clicked(source: CategoryItem, search?: boolean) {

            for (const [parent, contents] of this.state.categories_data.items) {

                // Search through parent category children for a match
                const target_search = contents.includes(source);

                if (this.state.pages_state.active_category != parent.id && target_search) {

                    this.state.last_clicked_category = { name: source.id, search };

                    if (this.state.component_display_state != 'STATE_INIT')
                        this.state.pages_state.active_category = parent.id;

                    break;
                }

                else if (this.state.pages_state.active_category == parent.id && target_search) {

                    this.state.last_clicked_category = { name: source.id, search };

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
            this.discriminate_component_state();

            this.$nextTick(() => this.state.render_state = true);
        },

        handle_render_state_change(state: boolean) {

            console.log(this.state.render_state, state);

            if (state != this.state.render_state) {

                this.state.render_state = state;

                if (!state)
                    this.state.last_clicked_category = undefined;
            }
        }
    },

    provide() {
        return {
            last_clicked_category: computed(() => this.state.last_clicked_category),
            critical_categories: computed(() => this.state.critical_categories),
            critical_only: computed(() => this.state.categories_state.critical_only)
        };
    },

    computed: mapState(['eventBusStore', '__metaData'])
});