import { defineComponent } from 'vue';

import Queue from '@/lib/queue';

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
    items: [string, CategoryItem[]][];
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
    icon_cache: Map<string, HTMLImageElement>;
}

export default defineComponent({

    data() {
        const internal_state: InternalComponentState = {
            icon_cache: new Map<string, HTMLImageElement>(),
            image_queue: new Queue<QueueIcon>(),
            preloaded_icons: false
        };

        return { internal_state };
    },

    methods: {
        get_category_items(items: CategoryItem[]) {
            if (this.state.critical_only) return items.filter(el => el.critical);
            return items;
        },

        load_category_icons(items: [string, CategoryItem[]][]) {
            for (const [parent, categories] of items) {

                for (const category of categories) {

                    // Skip 
                    if (this.internal_state.icon_cache.has(category.id)) continue;

                    const target_element = document.getElementById(category.id) as HTMLImageElement;

                    if (!target_element || target_element.childElementCount >= 1) continue;

                    const image_url = category.icon ? new URL(category.icon, import.meta.url) : new URL('/img/placeholder.png', import.meta.url);
                    const image_el  = new Image();

                    image_el.crossOrigin = 'Anonymous';
                    image_el.src         = image_url.href;

                    image_el.onload = () => {
                        if (image_el.complete || image_el.complete === undefined) {
                            this.internal_state.image_queue.Enqueue({ id: category.id, el: image_el });

                            // Cache image so we don't set it again
                            this.internal_state.icon_cache.set(category.id, image_el);
                        }
                    };

                    image_el.onerror = (err) => console.error(`Failed loading category icon.\n\n${err}`);
                }
            }

            // Handle queued items and signal preload completion
            if (this.internal_state.image_queue.length >= 1) while (this.internal_state.image_queue.length <= 0) {

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
        }
    },

    mounted() { this.$nextTick(() => { if (this.data?.items && this.data.items.length >= 1) this.load_category_icons(this.data.items); }); },

    watch: {

        /**
         * Loads all category icons ahead of time, emitting the ready event once we have loaded all of them.
         */
        'data.items': {
            handler(state: [[string, CategoryItem[]]]) { this.load_category_icons(state); },

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

    emits: ['ready', 'clicked']
});