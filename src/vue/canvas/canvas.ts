/**
 * This component is loosely based off of `vue-resizable` by `nikitasnv`:
 *
 *     https://github.com/nikitasnv/vue-resizable
 */

import { mapState, Store }            from 'vuex';
import { Component, defineComponent } from 'vue';

import { CanvasItemData, ModuleState } from '@/lib/store_settings';

import componentDraggable from './draggable/draggable.vue';
import store              from '@/lib/store';

export type DraggableItemRaw = { component: Component, editable: boolean, id: string };

/**
 * Individual draggable item.
 */
interface TrackedItem {

    /**
     * Item's X coordinate relative to the parent.
     * @type {number}
     */
    x: number;

    /**
     * Item's Y coordinate relative to the parent.
     * @type {number}
     */
    y: number;

    /**
     * Items width from the origin point.
     * @type {number}
     */
    w: number;

    /**
     * Items height from the origin point.
     * @type {number}
     */
    h: number;

    /**
     * Unique identifier for this draggable item.
     * @type {string}
     */
    id: string;

    /**
     * Vue component instance which to render as a resizable component.
     * @type {Element}
     */
    component: Component;

    /**
     * Denotes wether or not this item is editable or not.
     * @type {boolean}
     */
    editable: boolean;
}

/**
 * Mouse positioning data.
 */
interface ComponentStateMouse {

    /**
     * X position of the mouse.
     * @type {number}
     */
    x: number;

    /**
     * Y position of the mouse.
     * @type {number}
     */
    y: number;
}

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Denotes wether we are in edit mode.
     * @type {boolean}
     */
    edit: boolean;

    /**
     * Denotes wether or not user is dragging something.
     * @type {boolean}
     */
    dragging: boolean;

    /**
     * Denotes wether or not the user is scaling a container.
     * @type {boolean}
     */
    resizing: boolean;

    /**
     * Currently active handle, if `resizing` is set to `true`.
     * @enum {Handle}
     */
    handle?: Handle;

    /**
     * Currently active tracked item.
     * @type {TrackedItem}
     */
    active?: TrackedItem;

    /**
     * Current mouse position data.
     * @type {ComponentStateMouse}
     */
    mouse: ComponentStateMouse;
}

/**
 * Component data internal description interface.
 */
interface ComponentData {

    /**
     * An array containing all tracked 
     */
    items: TrackedItem[];
}

/**
 * All possible scale handle locations.
 */
enum Handle {
    BOTTOM_RIGHT = 'handle-bottom-right',
    BOTTOM_LEFT = 'handle-bottom-left',
    TOP_RIGHT = 'handle-top-right',
    TOP_LEFT = 'handle-top-left',
    BOTTOM = 'handle-bottom',
    RIGHT = 'handle-right',
    LEFT = 'handle-left',
    TOP = 'handle-top'
}

// Middle drag handle

const CLASS_HANDLE_DRAG = 'handle-drag';

// All known classes

const ALLOWED_SCALE_CLASSES = [
    'handle-bottom-right',
    'handle-bottom-left',
    'handle-top-right',
    'handle-top-left',
    'handle-bottom',
    'handle-right',
    'handle-left',
    'handle-top'
];

export default defineComponent({

    components: { componentDraggable },

    data() {

        const typed_store = store as Store<{ settingsStore: ModuleState }>;

        // State constants

        const resizing = false;

        const dragging = false;

        const edit = true;

        const x = 0;

        const y = 0;

        // Assembled sub-objects

        const mouse: ComponentStateMouse = {
            x,
            y
        };

        // Data constants

        const items: TrackedItem[] = [];

        // Populate items with prop data

        if (this.$props.items) for (const item of this.$props.items as DraggableItemRaw[]) {

            const target_data = typed_store.state.settingsStore.canvas_items[item.id];

            const id = item.id;

            const x = target_data.x;
            const y = target_data.y;

            const h = target_data.height;
            const w = target_data.width;

            const component = item.component;
            const editable  = item.editable;

            items.push({ component, editable, id, x, y, w, h });
        }

        // Final state & data objects

        const state: ComponentState = {
            resizing,
            dragging,
            mouse,
            edit
        };

        const data: ComponentData = {
            items
        };

        return { state, data };
    },

    mounted() {
        document.documentElement.addEventListener('mousedown', this.handle_down, true);
        document.documentElement.addEventListener('mousemove', this.handle_move, true);
        document.documentElement.addEventListener('mouseup',   this.handle_up,   true);
    },

    methods: {

        handle_down(event: MouseEvent) {

            const target = event.target as HTMLElement;

            if (this.state.edit && target && this.$el.contains(target)) {

                this.state.mouse.x = event.clientX;
                this.state.mouse.y = event.clientY;

                // Move the dragged thing
                if (target.classList.contains(CLASS_HANDLE_DRAG)) {
                    this.state.dragging = true;

                    if (target.parentElement?.parentElement) for (const item of this.data.items) if (target.parentElement.parentElement.classList.contains(item.id)) {

                        this.state.active = item;

                        break;
                    }
                }

                // Resize whatever we're handling right now
                else for (let i = 0; i < target.classList.length; i++) {

                    const target_class = target.classList[i] as Handle;

                    if (!target_class || !ALLOWED_SCALE_CLASSES.includes(target_class)) continue;

                    if (target.parentElement?.parentElement) for (const item of this.data.items) if (target.parentElement.parentElement.classList.contains(item.id)) {

                        this.state.active = item;

                        break;
                    }

                    this.state.handle   = target_class;
                    this.state.resizing = true;

                    break;
                }
            }
        },

        handle_move(event: MouseEvent) {

            /**
             * Returns a padded constant of the X value.
             */
            const get_x = (value: number) => {

                if (value < 16)
                    return 16;

                if (value > document.documentElement.clientWidth - 48)
                    return document.documentElement.clientWidth - 48;

                return value;
            };

            /**
             * Returns a padded constant of the X value.
             */
             const get_y = (value: number) => {

                if (value < 16)
                    return 16;

                if (value > document.documentElement.clientHeight - 48)
                    return document.documentElement.clientHeight - 48;

                return value;
            };

            // Do nothing if we don't have a target element
            if (!this.state.active) return;

            this.state.mouse.x = event.clientX;
            this.state.mouse.y = event.clientY;

            if (this.state.resizing) switch(this.state.handle) {

                case Handle.TOP_LEFT: {

                    this.state.active.h = this.state.active.h - (this.state.mouse.y - this.state.active.y);
                    this.state.active.y = this.state.mouse.y;

                    this.state.active.w = this.state.active.w - (this.state.mouse.x - this.state.active.x);
                    this.state.active.x = this.state.mouse.x;

                    break;
                }

                case Handle.TOP: {

                    this.state.active.h = this.state.active.h - (this.state.mouse.y - this.state.active.y);
                    this.state.active.y = this.state.mouse.y;

                    break;
                }

                case Handle.TOP_RIGHT: {

                    this.state.active.h = this.state.active.h - (this.state.mouse.y - this.state.active.y);
                    this.state.active.y = this.state.mouse.y;

                    this.state.active.w = this.state.mouse.x - this.state.active.x;

                    break;
                }

                case Handle.LEFT: {

                    this.state.active.w = this.state.active.w - (this.state.mouse.x - this.state.active.x);
                    this.state.active.x = this.state.mouse.x;

                    break;
                }

                case Handle.RIGHT: {

                    this.state.active.w = this.state.mouse.x - this.state.active.x;

                    break;
                }

                case Handle.BOTTOM_LEFT: {

                    this.state.active.w = this.state.active.w - (this.state.mouse.x - this.state.active.x);
                    this.state.active.x = this.state.mouse.x;

                    this.state.active.h = this.state.mouse.y - this.state.active.y;

                    break;
                }

                case Handle.BOTTOM: {

                    this.state.active.h = this.state.mouse.y - this.state.active.y;

                    break;
                }

                case Handle.BOTTOM_RIGHT: {

                    this.state.active.w = this.state.mouse.x - this.state.active.x;
                    this.state.active.h = this.state.mouse.y - this.state.active.y;

                    break;
                }
            }

            // Move target element around
            else if (this.state.dragging) {

                const left_offset = this.state.active.w / 2;
                const top_offset  = this.state.active.h / 2;

                this.state.active.x =  get_x(this.state.mouse.x - left_offset);
                this.state.active.y = get_y(this.state.mouse.y - top_offset);
            }
        },

        /**
         * Handles the mouse click exit event, setting all states to initial.
         */
        handle_up() {

            for (const item of this.data.items) {

                const target: CanvasItemData = this.settingsStore.canvas_items[item.id];

                if (
                    !target                 ||
                    target.x      != item.x ||
                    target.y      != item.y ||
                    target.height != item.h ||
                    target.width  != item.w
                ) {

                    const height = item.h;

                    const width = item.w;

                    const name = item.id;

                    const x = item.x;

                    const y = item.y;

                    const data: CanvasItemData = { height, width, x, y };

                    store.dispatch('settingsStore/UpdateCanvasItem', { name, data });
                }
            }

            if (this.state.dragging)
                this.state.dragging = false;

            if (this.state.resizing)
                this.state.resizing = false;

            if (this.state.handle)
                this.state.handle = undefined;

            if (this.state.active)
                this.state.active = undefined;
        }
    },

    computed: mapState(['eventBusStore', 'settingsStore']),

    props: ['items']
});