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
export type CategoryTuple = [string, CategoryItem[]];

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
    last_clicked_category?: string;

    /**
     * Array containing critical only mode IDs.
     */
    critical_categories: string[];
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
                    filtered: false,
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
                    filtered: false,
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
            'Date & Time',
            [
                {
                    name: 'Time Convention',
                    filtered: false,
                    critical: true,
                    id: 'time-convention-category',
                    keywords: [
                        'clock',
                        'critical'
                    ]
                },
                {
                    name: 'Time Display',
                    filtered: false,
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
                    filtered: false,
                    critical: true,
                    id: 'date-display-category',
                    keywords: [
                        'day',
                        'day format',
                        'critical'
                    ]
                }
            ]
        ];

        const miscellaneous_category: CategoryTuple = [
            'Miscellaneous',
            [
                {
                    name: 'Changelog',
                    filtered: false,
                    critical: false,
                    id: 'changelog-category',
                    keywords: [
                        'changes',
                        'updates'
                    ]
                },
                {
                    name: 'Privacy & Safety',
                    filtered: false,
                    critical: true,
                    id: 'privacy-and-safety-category',
                    keywords: [
                        'eula',
                        'licenses'
                    ]
                },
                {
                    name: 'Delete Data',
                    filtered: false,
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

            if (typeof target_match_name == 'string') {

                if (this.state.pages_state.active_category != target_match_name && this.state.component_display_state != 'STATE_INIT')
                    this.state.pages_state.active_category = target_match_name;

                this.state.last_clicked_category = source.id;
            }
        },

        handle_settings_open() {
            this.discriminate_component_state();

            this.$nextTick(() => this.state.render_state = true);
        },

        handle_render_state_change(state: boolean) { if (state != this.state.render_state) this.state.render_state = state; }
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