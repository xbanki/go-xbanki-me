import { mapState }        from 'vuex';
import { defineComponent } from 'vue';

import { CategoryItemState } from '@/lib/store_component_settings';
import { CategoryTuple }     from '@/vue/settings/settings';

import config from '@/lib/config';
import Queue  from '@/lib/queue';
import store  from '@/lib/store';

/**
 * Individual category display item.
 * @public
 */
export interface CategoryItem {

    /**
     * Shown only during updates or initialization states.
     * @type {boolean}
     */
    critical: boolean;

    /**
     * Category display icon element or URL.
     * @type {string}
     */
    icon?: string;

    /**
     * Category identifier.
     * @type {string}
     */
    id: string;

    /**
     * Search keywords which this category item is associated with.
     * @type {Array<string>}
     */
    keywords: string[];

    /**
     * Category item display name.
     * @type {string}
     */
    name: string;
}

/**
 * Category parent item.
 * @public
 */
export interface CategoryParent {

    /**
     * Denotes this item being filtered out in search mode.
     * @type {boolean}
     */
    filtered: boolean;

    /**
     * Unique category ID.
     * @type {string}
     */
    id: string;

    /**
     * Unique category name.
     * @type {string}
     */
    name: string;
}

/**
 * Component data internal description interface.
 * @public
 */
export interface ComponentData {

    /**
     * Component category items.
     * @type {Array<CategoryItem>}
     */
    items: CategoryTuple[];

    /**
     * Valid semver representation of the application version.
     * @ype {string}
     */
    version: string;
}

/**
 * Internal Queue item used for icon pre-loading.
 * @private
 */
interface QueueIcon {

    /**
     * Loaded & assembled `Image` element.
     * @type {Image}
     */
    el: HTMLImageElement;

    /**
     * Target element ID which to plug this icon into.
     * @type {string}
     */
    id: string;
}

/**
 * Component private state descriptor.
 * @private
 */
interface InternalComponentState {

    /**
     * Disables back navigation.
     * @type {boolean}
     */
    back: boolean;

    /**
     * Cache of all already loaded icons to avoid loading pre-existing icons multiple
     * times.
     * @type {Map<string, HTMLImageElement>}
     */
    cache: Array<string>;

    /**
     * Disables forward navigation.
     * @type {boolean}
     */
    forward: boolean;

    /**
     * Cache of all available category items so we can work with critical state correctly.
     * @type {Array<CategoryItem>}
     */
    items: Array<CategoryItem>;

    /**
     * Describes wether or not we have succesfully pre-loaded icons by calling
     * `get_category_items`.
     * @type {boolean}
     */
    preloaded: boolean;

    /**
     * Image queue populated by `Image` elements which all get plugged in to the
     * DOM after everything has finished loading.
     * @type {Queue<QueueIcon>}
     */
    queue: Queue<QueueIcon>;

    /**
     * Current search content.
     * @type {string}
     */
    search?: string;
}

export default defineComponent({

    data() {

        // Individual state constants

        const preloaded = false;

        const forward = false;

        const items: CategoryItem[] = [];

        const cache: string[] = [];

        const queue = new Queue<QueueIcon>();

        const back = false;

        // Assembled state object

        const state: InternalComponentState = {
            preloaded,
            forward,
            items,
            cache,
            queue,
            back
        };

        return { state };
    },

    mounted() {
        this.$nextTick(
            () => {

            const data = this.data as ComponentData;

            if (data?.items && data.items.length >= 1)
                this.load_category_icons(data.items);

            if (this.componentSettingsStore.is_critical_only)
                this.populate_category_states();
            }
        );
    },

    methods: {

        /**
         * Critical only method. Populates all subcategory highlight states for critical
         * only mode.
         */
        populate_category_states() {

            // State keys in order of appearance
            const keys: string[] = [];

            // Is true if we have found previously set state
            let prexisting: string | undefined = undefined;

            for (const item of this.state.items) {

                if (!item.critical || keys.includes(item.id)) continue;

                const target: CategoryItemState | undefined = this.componentSettingsStore.critical_only_categories_state[item.id];

                if (target != undefined && target == CategoryItemState.ACTIVE)
                    prexisting = item.id;

                else
                    store.dispatch('componentSettingsStore/UpdateCategoriesState', { target: item.id, state: CategoryItemState.INITIAL });

                keys.push(item.id);
            }

            if (prexisting != undefined) {

                // Index of previously set state item
                const target = keys.indexOf(prexisting);

                if (target == 0)
                    this.state.back = true;

                if (target == keys.length)
                    this.state.forward = true;
            }

            else {
                this.state.back = true;

                store.dispatch('componentSettingsStore/UpdateCategoriesState', { target: keys[0], state: CategoryItemState.ACTIVE });
            }
        },

        /**
         * Cticial only method. Returns highlight state for subcategory with matching
         * `key` parameter.
         */
        get_category_state(key: string) { return this.componentSettingsStore.critical_only_categories_state[key]; },

        /**
         * Critical only method. Returns the highlight state of the next available
         * subcategory item.
         */
        get_next_category_state(key: string): string | undefined {

            const target_keys       = Object.keys(this.componentSettingsStore.critical_only_categories_state);
            const target_item_index = target_keys.indexOf(key);

            if (target_item_index != -1 && !(target_item_index >= target_keys.length))
                return this.componentSettingsStore.critical_only_categories_state[target_keys[target_item_index + 1]];

            return undefined;
        },

        /**
         * Returns category items, either all of them or only critical ones.
         */
        get_category_items(items: CategoryItem[]) {

            // Compare cache size to determine wether we need to populate it or not
            if (items.length != this.state.items.length)

                items.forEach(
                    el => {

                        if (!this.state.items.includes(el))
                            this.state.items.push(el);
                    }
                );

            if (this.componentSettingsStore.is_critical_only) return items.filter(el => el.critical);
                return items;
        },

        /**
         * Critical only method. Handles subcategory click & handles their highlight
         * state.
         */
        handle_category_click(item: CategoryItem, standalone = true) {

            if (this.componentSettingsStore.is_critical_only) {

                const clicked_category_key   = Object.keys(this.componentSettingsStore.critical_only_categories_state).find(el => el ==item.id);
                const clicked_category_state = this.componentSettingsStore.critical_only_categories_state[clicked_category_key as string] as CategoryItemState | undefined;

                const active_category_key   = Object.keys(this.componentSettingsStore.critical_only_categories_state).find(el => this.componentSettingsStore.critical_only_categories_state[el] == CategoryItemState.ACTIVE);
                const active_category_state = this.componentSettingsStore.critical_only_categories_state[active_category_key as string] as CategoryItemState | undefined;

                if (clicked_category_key == active_category_key || !clicked_category_state || !active_category_state) return;

                if (clicked_category_state == CategoryItemState.INITIAL) {
                    const clicked_index = Object.keys(this.componentSettingsStore.critical_only_categories_state).indexOf(clicked_category_key as string);
                    const active_index = Object.keys(this.componentSettingsStore.critical_only_categories_state).indexOf(active_category_key as string);

                    if (Math.abs(clicked_index - active_index) >= 2 || Math.abs(active_index - clicked_index) >= 2) return;
                }

                if (standalone) {
                    const clicked_index = Object.keys(this.componentSettingsStore.critical_only_categories_state).indexOf(clicked_category_key as string);
                    const categories_length = Object.keys(this.componentSettingsStore.critical_only_categories_state).length - 1;

                    if (clicked_index >= categories_length) {
                        this.state.forward = true;
                        this.state.back = false;
                    }

                    else if (clicked_index <= 0) {
                        this.state.forward = false;
                        this.state.back = true;
                    }

                    else {
                        this.state.forward = false;
                        this.state.back = false;
                    }
                }

                store.dispatch('componentSettingsStore/UpdateCategoriesState', { target: clicked_category_key, state: CategoryItemState.ACTIVE });
                store.dispatch('componentSettingsStore/UpdateCategoriesState', { target: active_category_key, state: CategoryItemState.VISITED });
            }

            this.$emit('category-clicked', item);
        },

        /**
         * Critical only method. Navigates to previous available subcategory, along
         * with setting navigation button enable/ disable states.
         */
        handle_navigation_previous() {

            // Filtered items to include only critical ones
            const filtered_items = this.state.items.filter(el => el.critical);

            if (filtered_items) for (const item of filtered_items) if (this.componentSettingsStore.critical_only_categories_state[item.id] == CategoryItemState.ACTIVE) {

                // Previous (next?) item accessed by index
                const index = filtered_items.indexOf(item) - 1;

                this.handle_category_click(filtered_items[index], false);

                if (index <= 0)
                    this.state.back = true;

                break;
            }

            this.state.forward = false;
        },

        /**
         * Critical only method. Navigates to mext available subcategory, along with
         * setting navigation button enable/ disable states.
         */
        handle_navigation_next() {

            const filtered_items = this.state.items.filter(el => el.critical);

            if (filtered_items) for (const item of filtered_items) if (this.componentSettingsStore.critical_only_categories_state[item.id] == CategoryItemState.ACTIVE) {

                const index = filtered_items.indexOf(item) + 1;

                this.handle_category_click(filtered_items[index], false);

                if (index >= filtered_items.length - 1)
                    this.state.forward = true;

                break;
            }

            this.state.back = false;
        },

        /**
         * Settings only method. Search algorithm.
         */
        handle_search_input(input: Event) {

            const target = input.target as HTMLInputElement;

            if (target.value.length >= 1) {

                store.commit('componentSettingsStore/UPDATE_SEARCHING_STATE', true);

                const value = target.value.toLowerCase().trim();

                this.state.search = value;

                for (const item of this.data.items) {

                    const parent: CategoryParent = item[0];
                    const items: CategoryItem[]  = item[1];

                    let has_matching_keyword = false;

                    if (parent.name.toLowerCase().trim().includes(value))
                        has_matching_keyword = true;

                    else {

                        has_matching_keyword = false;

                        for (const item of items) {

                            if (item.name.toLowerCase().trim().includes(value)) {

                                has_matching_keyword = true;

                                break;
                            }

                            for (const keyword of item.keywords) if (keyword.toLocaleLowerCase().trim().includes(value)) {

                                has_matching_keyword = true;

                                break;
                            }
                        }
                    }

                    parent.filtered = !has_matching_keyword;
                }
            }

            else {

                store.commit('componentSettingsStore/UPDATE_SEARCHING_STATE', false);

                for (const [parent, items] of this.data.items)
                    parent.filtered = false;

                this.state.search = undefined;
            }
        },

        /**
         * Settings only method. Clears search content & disables search mode.
         */
        clear_search_content() {

            // Search box element reference
            const element = this.$refs.search as HTMLInputElement;

            if (!element) return;

            for (const [parent, items] of this.data.items)
                parent.filtered = false;

            this.$nextTick(() => store.commit('componentSettingsStore/UPDATE_SEARCHING_STATE', false));

            element.value = '';
        },

        /**
         * Loads mock icons for all categories and subcategories.
         * @note This will get replaced later by glob svg loader.
         */
        async load_category_icons(items: CategoryTuple[]) {

            for await (const [parent, categories] of items) {

                if (config.dev_mode) console.log(`Loading icons for category: ${parent}`);

                const parent_image_url = new URL('/img/placeholder.png', import.meta.url);
                const parent_image_el  = new Image();

                parent_image_el.crossOrigin = 'Anonymous';
                parent_image_el.src         = parent_image_url.href;

                if (parent_image_el && !this.state.cache.find(el => el == parent.id)) {

                    await new Promise<void>(
                        (Res: () => void, Rej: () => void) => {

                            // Cache image so we don't set it again
                            this.state.cache.push(parent.id);

                            // Loaded image stuff
                            parent_image_el.onload = () => {

                                if (parent_image_el.complete || parent_image_el.complete === undefined) {
                                    this.state.queue.Enqueue({ id: parent.id, el: parent_image_el });

                                    return Res();
                                }
                            };

                            // Failure stuff
                            parent_image_el.onerror = err => {

                                this.state.cache.splice(this.state.cache.indexOf(parent.id, 1));

                                if (config.dev_mode) console.error(`Failed loading category icon.\n\n${err}`);

                                return Rej();
                            };
                        }
                    );
                }

                for await (const category of categories) {

                    // Skip cached image
                    if (this.state.cache.find(el => el == category.id)) continue;

                    const target_element = document.getElementById(category.id) as HTMLImageElement;

                    if (!target_element || target_element.childElementCount >= 1) continue;

                    const image_url = category.icon ? new URL(category.icon, import.meta.url) : new URL('/img/placeholder.png', import.meta.url);
                    const image_el  = new Image();

                    image_el.crossOrigin = 'Anonymous';
                    image_el.src         = image_url.href;

                    // Promiseify so we can wait for image loading correctly
                    await new Promise<void>(

                        // Res: Resolve promise, Rej: Reject promise
                        (Res: () => void, Rej: () => void) => {

                            // Cache image so we don't set it again
                            this.state.cache.push(category.id);

                            // Loaded image stuff
                            image_el.onload = () => {
                                if (image_el.complete || image_el.complete === undefined) {
                                    this.state.queue.Enqueue({ id: category.id, el: image_el });

                                    return Res();
                                }
                            };

                            // Failure stuff
                            image_el.onerror = err => {
                                this.state.cache.splice(this.state.cache.indexOf(category.id, 1));

                                if (config.dev_mode) console.error(`Failed loading category icon.\n\n${err}`);

                                return Rej();
                            };
                        }
                    );
                }
            }

            // Handle queued items and signal preload completion
            if (this.state.queue.length >= 1) while (this.state.queue.length >= 0) {

                const target_icon = this.state.queue.Dequeue();

                if (!target_icon) break;

                const target_element = document.getElementById(target_icon.id);

                if (!target_element) continue;

                target_element.appendChild(target_icon.el);
            }

            // Emit state change
            if (!this.state.preloaded) {
                this.state.preloaded = true;
                this.$emit('ready');
            }
        },

        /**
         * Settings only method. Navigates between displayed pages. If search mode
         * is `true`, we also emit current search data.
         */
        handle_parent_click(category: CategoryParent) {

            // Target category that we have clicked
            const target = this.data.items.find((el: CategoryTuple) => el[0].id == category.id);

            if (target && this.componentSettingsStore.is_searching) {

                this.$emit('parent-clicked', { search: this.state.search, category });

                this.$nextTick(() => this.clear_search_content());
            }

            else if (target)
                this.$emit('parent-clicked', { category });
        },

        /**
         * Closes the settings component, clearing search content & resetting critical
         * only highlight state.
         */
        close_settings_component() {

            if (Object.keys(this.state.items).length >= 1)
                store.commit('componentSettingsStore/UPDATE_CRITICAL_ONLY_CATEGORIES_STATE', { });

            this.clear_search_content();

            store.commit('componentSettingsStore/UPDATE_RENDER_STATE', false);
        }
    },

    watch: {

        /**
         * Loads all category icons ahead of time, emitting the ready event once we have loaded all of them.
         */
        'data.items'(state: CategoryTuple[]) { this.load_category_icons(state); },

        /**
         * Loads all critical-only progress state.
         */
        'componentSettingsStore.is_critical_only'(state: boolean) { if (state) this.populate_category_states(); }
    },

    computed: mapState(['settingsStore', 'componentSettingsStore']),

    emits: ['ready', 'parent-clicked', 'category-clicked', 'close'],

    props: {
        data: {
            required: true,
            type: Object,
            default: { },
            validator: (value: any) => (value != undefined && typeof value == 'object')
        }
    }
});