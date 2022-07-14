import { mapState }        from 'vuex';
import { defineComponent } from 'vue';

import { CategoryTuple }      from '@/vue/settings/settings';
import { CategoryItemState } from '@/lib/store_event_bus';

import config from '@/lib/config';
import Queue  from '@/lib/queue';
import store  from '@/lib/store';

/**
 * Component internal state.
 * @public
 */
export interface ComponentState {

    /**
     * Displays "critical" category options, which will only be active
     * if we are in initialization mode.
     * @type {boolean}
     */
    critical_only: boolean;
}

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
     * Category item display name.
     * @type {string}
     */
    name: string;

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
     * Unique category name.
     * @type {string}
     */
    name: string;

    /**
     * Unique category ID.
     * @type {string}
     */
    id: string;
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
     * Target element ID which to plug this icon into.
     * @type {string}
     */
    id: string;

    /**
     * Loaded & assembled `Image` element.
     * @type {Image}
     */
    el: HTMLImageElement;
}

/**
 * Component private state descriptor.
 * @private
 */
interface InternalComponentState {

    /**
     * Describes wether or not we have succesfully pre-loaded icons by calling
     * `get_category_items`.
     * @type {boolean}
     */
    preloaded_icons: boolean;

    /**
     * Image queue populated by `Image` elements which all get plugged in to the
     * DOM after everything has finished loading.
     * @type {Queue<QueueIcon>}
     */
    image_queue: Queue<QueueIcon>;

    /**
     * Cache of all already loaded icons to avoid loading pre-existing icons multiple
     * times.
     * @type {Map<string, HTMLImageElement>}
     */
    icon_cache: Array<string>;

    /**
     * Cache of all available category items so we can work with critical state correctly.
     * @type {Array<CategoryItem>}
     */
    all_category_items: Array<CategoryItem>;

    /**
     * Denotes wether or not we are in search mode.
     * @type {boolean}
     */
    is_searching: boolean;

    /**
     * Disables forward navigation.
     * @type {boolean}
     */
    disable_forward: boolean;

    /**
     * Disables back navigation.
     * @type {boolean}
     */
    disable_back: boolean;
}

export default defineComponent({

    data() {
        const internal_state: InternalComponentState = {
            image_queue: new Queue<QueueIcon>(),
            preloaded_icons: false,
            all_category_items: [],
            disable_forward: false,
            is_searching: false,
            disable_back: false,
            icon_cache: []
        };

        return { internal_state };
    },

    methods: {
        handle_search_input(input: Event) {

            const target = input.target as HTMLInputElement;

            if (target.value.length >= 1) {
                this.internal_state.is_searching = true;

                const value = target.value.toLowerCase().trim();

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
                for (const [parent, items] of this.data.items)
                    parent.filtered = false;

                this.internal_state.is_searching = false;
            }
    },

        get_category_items(items: CategoryItem[]) {

            // Compare cache size to determine wether we need to populate it or not
            if (items.length != this.internal_state.all_category_items.length) items.forEach(
                (el) => { if (!this.internal_state.all_category_items.includes(el)) this.internal_state.all_category_items.push(el); }
            );

            if (this.state.critical_only) return items.filter(el => el.critical);
            return items;
        },

        async load_category_icons(items: CategoryTuple[]) {

            for await (const [parent, categories] of items) {

                if (config.dev_mode) console.log(`Loading icons for category: ${parent}`);

                const parent_image_url = new URL('/img/placeholder.png', import.meta.url);
                const parent_image_el  = new Image();

                parent_image_el.crossOrigin = 'Anonymous';
                parent_image_el.src         = parent_image_url.href;

                if (parent_image_el && !this.internal_state.icon_cache.find((el) => el == parent.id)) {

                    await new Promise<void>(
                        (Res: () => void, Rej: () => void) => {

                            // Cache image so we don't set it again
                            this.internal_state.icon_cache.push(parent.id);

                            // Loaded image stuff
                            parent_image_el.onload = () => {

                                if (parent_image_el.complete || parent_image_el.complete === undefined) {
                                    this.internal_state.image_queue.Enqueue({ id: parent.id, el: parent_image_el });

                                    return Res();
                                }
                            };

                            // Failure stuff
                            parent_image_el.onerror = (err) => {

                                this.internal_state.icon_cache.splice(this.internal_state.icon_cache.indexOf(parent.id, 1));

                                if (config.dev_mode) console.error(`Failed loading category icon.\n\n${err}`);

                                return Rej();
                            };
                        }
                    );
                }

                for await (const category of categories) {

                    // Skip cached image
                    if (this.internal_state.icon_cache.find((el) => el == category.id)) continue;

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
                            this.internal_state.icon_cache.push(category.id);

                            // Loaded image stuff
                            image_el.onload = () => {
                                if (image_el.complete || image_el.complete === undefined) {
                                    this.internal_state.image_queue.Enqueue({ id: category.id, el: image_el });

                                    return Res();
                                }
                            };

                            // Failure stuff
                            image_el.onerror = (err) => {
                                this.internal_state.icon_cache.splice(this.internal_state.icon_cache.indexOf(category.id, 1));

                                if (config.dev_mode) console.error(`Failed loading category icon.\n\n${err}`);

                                return Rej();
                            };
                        }
                    );
                }
            }

            // Handle queued items and signal preload completion
            if (this.internal_state.image_queue.length >= 1) while (this.internal_state.image_queue.length >= 0) {

                const target_icon = this.internal_state.image_queue.Dequeue();

                if (!target_icon) break;

                const target_element = document.getElementById(target_icon.id);

                if (!target_element) continue;

                target_element.appendChild(target_icon.el);
            }

            // Emit state change
            if (!this.internal_state.preloaded_icons) {
                this.internal_state.preloaded_icons = true;
                this.$emit('ready');
            }
        },

        populate_category_states() {

            // State keys in order of appearance
            const keys: string[] = [];

            // Is true if we have found previously set state
            let prexisting: string | undefined = undefined;

            for (const item of this.internal_state.all_category_items) {

                if (!item.critical || keys.includes(item.id)) continue;

                const target: CategoryItemState | undefined = this.eventBusStore.critical_only_categories_state[item.id];

                if (target != undefined && target == CategoryItemState.ACTIVE)
                    prexisting = item.id;

                else
                    store.dispatch('eventBusStore/UpdateCategoriesState', { target: item.id, state: CategoryItemState.INITIAL });

                keys.push(item.id);
            }

            if (prexisting != undefined) {
                const target = keys.indexOf(prexisting);

                if (target == 0)
                    this.internal_state.disable_back = true;

                if (target == keys.length)
                    this.internal_state.disable_forward = true;
            }

            else {
                this.internal_state.disable_back = true;

                store.dispatch('eventBusStore/UpdateCategoriesState', { target: keys[0], state: CategoryItemState.ACTIVE });
            }
        },

        handle_category_click(item: CategoryItem, standalone = true) {

            if (this.state.critical_only) {

                const clicked_category_key   = Object.keys(this.eventBusStore.critical_only_categories_state).find((el) => el ==item.id);
                const clicked_category_state = this.eventBusStore.critical_only_categories_state[clicked_category_key as string] as CategoryItemState | undefined;

                const active_category_key   = Object.keys(this.eventBusStore.critical_only_categories_state).find((el) => this.eventBusStore.critical_only_categories_state[el] == CategoryItemState.ACTIVE);
                const active_category_state = this.eventBusStore.critical_only_categories_state[active_category_key as string] as CategoryItemState | undefined;

                if (clicked_category_key == active_category_key || !clicked_category_state || !active_category_state) return;

                if (clicked_category_state == CategoryItemState.INITIAL) {
                    const clicked_index = Object.keys(this.eventBusStore.critical_only_categories_state).indexOf(clicked_category_key as string);
                    const active_index = Object.keys(this.eventBusStore.critical_only_categories_state).indexOf(active_category_key as string);

                    if (Math.abs(clicked_index - active_index) >= 2 || Math.abs(active_index - clicked_index) >= 2) return;
                }

                if (standalone) {
                    const clicked_index = Object.keys(this.eventBusStore.critical_only_categories_state).indexOf(clicked_category_key as string);
                    const categories_length = Object.keys(this.eventBusStore.critical_only_categories_state).length - 1;

                    if (clicked_index >= categories_length) {
                        this.internal_state.disable_forward = true;
                        this.internal_state.disable_back = false;
                    }

                    else if (clicked_index <= 0) {
                        this.internal_state.disable_forward = false;
                        this.internal_state.disable_back = true;
                    }

                    else {
                        this.internal_state.disable_forward = false;
                        this.internal_state.disable_back = false;
                    }
                }

                store.dispatch('eventBusStore/UpdateCategoriesState', { target: clicked_category_key, state: CategoryItemState.ACTIVE });
                store.dispatch('eventBusStore/UpdateCategoriesState', { target: active_category_key, state: CategoryItemState.VISITED });
            }

            this.$emit('clicked', item);
        },

        handle_parent_click(category: CategoryParent) {

            const target: CategoryTuple = this.data.items.find((el: CategoryTuple) => el[0].id == category.id);

            if (target) for (const category of target[1]) {

                this.$emit('clicked', category);

                break;
            }
        },

        get_next_category_state(key: string): string | undefined {
            const target_keys = Object.keys(this.eventBusStore.critical_only_categories_state);
            const target_item_index = target_keys.indexOf(key);

            if (target_item_index != -1 && !(target_item_index >= target_keys.length)) {
                return this.eventBusStore.critical_only_categories_state[target_keys[target_item_index + 1]];
            }

            return undefined;
        },

        get_category_state(key: string) { return this.eventBusStore.critical_only_categories_state[key]; },

        clear_search_content() {

            const element = this.$refs.search as HTMLInputElement;

            for (const [parent, items] of this.data.items)
                parent.filtered = false;

            this.internal_state.is_searching = false;
            element.value = '';

        },

        handle_navigation_previous() {

            const filtered_items = this.internal_state.all_category_items.filter((el) => el.critical);

            if (filtered_items) for (const item of filtered_items) if (this.eventBusStore.critical_only_categories_state[item.id] == CategoryItemState.ACTIVE) {

                const index = filtered_items.indexOf(item) - 1;

                this.handle_category_click(filtered_items[index], false);

                if (index <= 0)
                    this.internal_state.disable_back = true;

                break;
            }

            this.internal_state.disable_forward = false;
        },

        handle_navigation_next() {

            const filtered_items = this.internal_state.all_category_items.filter((el) => el.critical);

            if (filtered_items) for (const item of filtered_items) if (this.eventBusStore.critical_only_categories_state[item.id] == CategoryItemState.ACTIVE) {

                const index = filtered_items.indexOf(item) + 1;

                this.handle_category_click(filtered_items[index], false);

                if (index >= filtered_items.length - 1)
                    this.internal_state.disable_forward = true;

                break;
            }

            this.internal_state.disable_back = false;
        },

        close_settings_component() {

            if (Object.keys(this.internal_state.all_category_items).length >= 1)
                store.commit('eventBusStore/UPDATE_CRITICAL_ONLY_CATEGORIES_STATE', { });

            this.$emit('close', false);
        }
    },

    mounted() { this.$nextTick(() => { if (this.data?.items && this.data.items.length >= 1) this.load_category_icons(this.data.items); if (this.state.critical_only) this.populate_category_states(); }); },

    watch: {

        /**
         * Loads all category icons ahead of time, emitting the ready event once we have loaded all of them.
         */
        'data.items': {
            handler(state: CategoryTuple[]) { this.load_category_icons(state); },
            immediate: true,
            deep: true
        },

        /**
         * Loads all critical-only progress state.
         */
        'state.critical_only': {
            handler(state: boolean) { if (state) this.populate_category_states(); },
            immediate: true,
            deep: true
        }
    },

    props: {
        state: {
            required: true,
            type: Object,
            default: {},
            validator: (value: any) => (value != undefined && typeof value == 'object')
        },

        data: {
            required: true,
            type: Object,
            default: {},
            validator: (value: any) => (value != undefined && typeof value == 'object')
        }
    },

    computed: mapState(['settingsStore', 'eventBusStore']),

    emits: ['ready', 'clicked', 'close']
});