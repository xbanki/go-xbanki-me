import { mapState }        from 'vuex';
import { defineComponent } from 'vue';

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
}

export default defineComponent({

    components: {
        categoriesComponent,
        modalComponent,
        pagesComponent
    },

    data() {

        // Appearance categories

        const appearance_parent: CategoryParent = {
            filtered: false,
            id: 'page-appearance',
            name: 'Appearance'
        };

        const appearance_category_theme: CategoryItem = {
            name: 'Theme',
            critical: false,
            id: 'theme-category',
            keywords: [
                'automatic',
                'darkmode',
                'lightmode'
            ]
        };

        const appearance_category_background_fit: CategoryItem = {
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
        };

        const appearance_category_ui_layout: CategoryItem = {
            name: 'UI Layout',
            critical: false,
            id: 'ui-layout-category',
            keywords: [
                'reset layout'
            ]
        };

        // Date & Time categories

        const date_time_parent: CategoryParent = {
            filtered: false,
            id: 'page-date-and-time',
            name: 'Date & Time'
        };

        const date_time_category_time_convention: CategoryItem = {
            name: 'Time Convention',
            critical: true,
            id: 'time-convention-category',
            keywords: [
                'clock',
                'critical'
            ]
        };

        const date_time_category_time_display: CategoryItem = {
            name: 'Time Display',
            critical: true,
            id: 'time-display-category',
            keywords: [
                'clock format',
                'critical',
                'time format'
            ]
        };

        const date_time_category_date_display: CategoryItem = {
            name: 'Date Display',
            critical: true,
            id: 'date-display-category',
            keywords: [
                'day',
                'day format',
                'date format',
                'critical'
            ]
        };

        // Miscellaneous categories

        const miscellaneous_parent: CategoryParent = {
            filtered: false,
            id: 'page-miscellaneous',
            name: 'Miscellaneous'
        };

        const miscellaneous_category_changelog: CategoryItem = {
            name: 'Changelog',
            critical: false,
            id: 'changelog-category',
            keywords: [
                'changes'
            ]
        };

        const miscellaneous_category_privacy_safety: CategoryItem = {
            name: 'Privacy & Safety',
            critical: true,
            id: 'privacy-and-safety-category',
            keywords: [
                'eula',
                'licenses'
            ]
        };

        const miscellaneous_category_delete_data: CategoryItem = {
            name: 'Delete Data',
            critical: false,
            id: 'delete-data-category',
            keywords: [
                'remove',
                'rm',
                'save'
            ]
        };

        // Final categories constants

        const appearance_category: CategoryTuple = [appearance_parent, [appearance_category_theme, appearance_category_background_fit, appearance_category_ui_layout]];

        const date_time_category: CategoryTuple = [date_time_parent, [date_time_category_time_convention, date_time_category_time_display, date_time_category_date_display]];

        const miscellaneous_category: CategoryTuple = [miscellaneous_parent, [miscellaneous_category_changelog, miscellaneous_category_privacy_safety, miscellaneous_category_delete_data]];

        const items: CategoryTuple[] = [appearance_category, date_time_category, miscellaneous_category];

        // Final state & data objects

        const categories_data: CategoriesData = { version,  items };

        const pages_state: PagesState = { categories: items };

        const state: ComponentState = {
            categories_data,
            pages_state
        };

        return { state };
    },

    mounted() {
        this.$nextTick(
            () => {

                if (!this.discriminate_component_state())
                    store.commit('componentSettingsStore/UPDATE_RENDER_STATE', true);
            }
        );
    },

    methods: {

        /**
         * Discriminates wether or not this app has been launched before, which
         * we use for launching the settings component automatically.
         */
        discriminate_component_state(): boolean {

            const localstorage_availlable = verify_localstorage_availlability();

            if (localstorage_availlable && !localStorage.getItem(`metadata-${this.__metaData.application_name}`)) {

                store.commit('componentSettingsStore/UPDATE_CRITICAL_ONLY', true);

                return false;
            }

            else {

                store.commit('componentSettingsStore/UPDATE_CRITICAL_ONLY', false);

                return true;
            }
        },

        /**
         * Handles subcategory click, which changes the active page state & updates
         * the last clicked category global.
         */
        handle_category_clicked(source: CategoryItem) {

            for (const [parent, contents] of this.state.categories_data.items) {

                // Search through parent category children for a match
                const target_search = contents.includes(source);

                if (this.state.pages_state.active != parent.id && target_search) {

                    store.commit('componentSettingsStore/UPDATE_LAST_CLICKED_CATEGORY', source.id);

                    if (!this.componentSettingsStore.is_critical_only)
                        this.state.pages_state.active = parent.id;

                    break;
                }

                else if (this.state.pages_state.active == parent.id && target_search) {

                    store.commit('componentSettingsStore/UPDATE_LAST_CLICKED_CATEGORY', source.id);

                    break;
                }
            }
        },

        /**
         * Handles parent category click, which also emits search signals to subcategories
         * if the user has clicked with search mode active.
         */
        handle_parent_clicked(source: { category: CategoryParent, search?: string }) {

            for (const [parent, items] of this.state.categories_data.items) {

                if (parent.id.toLocaleLowerCase().trim().includes(source.category.id.trim().toLocaleLowerCase())) {

                    if (source.search && this.componentSettingsStore.is_searching) {

                        const predicate = (el: CategoryItem): boolean => {

                            // Target category name in a normalized form
                            const target = el.name.trim().toLowerCase();

                            // User input search string that is also normalized
                            const search = source.search?.trim().toLowerCase() ?? '';

                            // Flag that denotes wether or not the name or any of the keywords match
                            let found = false;

                            if (source.search) if (target.includes(search))
                                found = true;

                            if (!found) for (const keyword of el.keywords) {

                                if (keyword.trim().toLowerCase().includes(search)) {

                                    found = true;

                                    break;
                                }
                            }

                            return found;
                        };

                        // Target category
                        const target = items.find(predicate);

                        if (target)
                            this.handle_category_clicked(target);

                        else
                            this.state.pages_state.active = parent.id;
                    }

                    else
                        this.state.pages_state.active = source.category.id;

                    break;
                }
            }
        },

        /**
         * Settings open button callback that also sets all required critical flags.
         */
        handle_settings_open() {

            // We discriminate to set critical only flags
            this.discriminate_component_state();

            this.$nextTick(() => store.commit('componentSettingsStore/UPDATE_RENDER_STATE', true));
        }
    },

    watch: {
        'componentSettingsStore.is_rendering'(state: boolean) { if (!state) store.commit('componentSettingsStore/UPDATE_LAST_CLICKED_CATEGORY', undefined); }
    },

    computed: mapState(['componentSettingsStore', '__metaData'])
});