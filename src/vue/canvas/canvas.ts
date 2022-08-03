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

/**
 * Minimum or maximum sizing data for raw items.
 */
export interface DraggableItemRawSizes {

    /**
     * Minimum/ maximum width of this item.
     * @type {number}
     */
    w: number;

    /**
     * Minimum/ maximum height of this item.
     * @type {number}
     */
    h: number;
}

export type DraggableItemRaw = { component: Component, editable: boolean, id: string, min?: DraggableItemRawSizes };

/**
 * Individual draggable item.
 */
interface TrackedItem {

    /**
     * Tracked item position data.
     */
    position: {

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
    }

    /**
     * Tracked item sizing data.
     */
    size: {

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
    }

    /**
     * Tracked item minimum data.
     */
    min: {

        /**
         * Minimum allowed with.
         * @type {number}
         */
        w: number;

        /**
         * Minimum allowed height.
         * @type {number}
         */
        h: number;
    }

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

// The closest draggable components are allowed to get to the edge (in pixels)

const EDGE_PADDING = 24;

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

            const min_w = item.min?.w ?? 0;
            const min_h = item.min?.h ?? 0;

            const x = target_data.x;
            const y = target_data.y;

            const h = target_data.height;
            const w = target_data.width;

            const component = item.component;
            const editable  = item.editable;

            const position =               { x, y };
            const size     =               { w, h };
            const min      = { w: min_w, h: min_h };

            items.push({ component, editable, position, size, min, id });
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

            // Do nothing if we don't have a target element
            if (!this.state.active) return;

            this.state.mouse.x = event.clientX;
            this.state.mouse.y = event.clientY;

            if (this.state.resizing) switch(this.state.handle) {

                case Handle.TOP_LEFT: {

                    // Target constants
                    const height = this.state.active.size.h - (this.state.mouse.y - this.state.active.position.y);
                    const width  = this.state.active.size.w - (this.state.mouse.x - this.state.active.position.x);
                    const left   = this.state.mouse.x;
                    const top    = this.state.mouse.y;

                    let allowed_left = true;
                    let allowed_top = true;

                    if (left <= EDGE_PADDING || width <= this.state.active.min.w)
                        allowed_left = false;

                    if (top <= EDGE_PADDING || height <= this.state.active.min.h)
                        allowed_top = false;

                    // Vertical
                    if (allowed_top) this.state.active.size.h = height;
                    if (allowed_top) this.state.active.position.y = top;

                    // Horizontal
                    if (allowed_left) this.state.active.size.w = width;
                    if (allowed_left) this.state.active.position.x = left;

                    break;
                }

                case Handle.TOP: {

                    const height = this.state.active.size.h - (this.state.mouse.y - this.state.active.position.y);
                    const top    = this.state.mouse.y;

                    let allowed_top = true;

                    if (top <= EDGE_PADDING || height <= this.state.active.min.h)
                        allowed_top = false;

                    if (allowed_top) this.state.active.size.h = height;
                    if (allowed_top) this.state.active.position.y = top;

                    break;
                }

                case Handle.TOP_RIGHT: {

                    const parent = this.$el as Element;

                    const height = this.state.active.size.h - (this.state.mouse.y - this.state.active.position.y);
                    const width  = this.state.mouse.x - this.state.active.position.x;
                    const top    = this.state.mouse.y;

                    let allowed_right = true;
                    let allowed_top   = true;

                    if (width + this.state.active.position.x >= parent.clientWidth - EDGE_PADDING || width <= this.state.active.min.w)
                        allowed_right = false;

                    if (top <= EDGE_PADDING || height <= this.state.active.min.h)
                        allowed_top = false;

                    if (allowed_right) this.state.active.size.w = width;

                    if (allowed_top) this.state.active.size.h = height;
                    if (allowed_top) this.state.active.position.y = top;

                    break;
                }

                case Handle.LEFT: {

                    const width = this.state.active.size.w - (this.state.mouse.x - this.state.active.position.x);
                    const left  = this.state.mouse.x;

                    let allowed_left = true;

                    if (left <= EDGE_PADDING || width <= this.state.active.min.w)
                        allowed_left = false;

                    if (allowed_left) this.state.active.position.x = left;
                    if (allowed_left) this.state.active.size.w = width;

                    break;
                }

                case Handle.RIGHT: {

                    const parent = this.$el as Element;

                    const width = this.state.mouse.x - this.state.active.position.x;

                    let allowed_right = true;

                    if (width + this.state.active.position.x >= parent.clientWidth - EDGE_PADDING || width <= this.state.active.min.w)
                        allowed_right = false;

                    if (allowed_right) this.state.active.size.w = width;

                    break;
                }

                case Handle.BOTTOM_LEFT: {

                    const parent = this.$el as Element;

                    const height = this.state.mouse.y - this.state.active.position.y;
                    const width  = this.state.active.size.w - (this.state.mouse.x - this.state.active.position.x);
                    const left   = this.state.mouse.x;

                    let allowed_height = true;
                    let allowed_left   = true;

                    if (left <= EDGE_PADDING || width <= this.state.active.min.w)
                        allowed_left = false;

                    if (height + this.state.active.position.y >= parent.clientHeight - EDGE_PADDING || height <= this.state.active.min.h)
                        allowed_height = false;

                    if (allowed_height) this.state.active.size.h = height;

                    if (allowed_left) this.state.active.position.x = left;
                    if (allowed_left) this.state.active.size.w = width;

                    break;
                }

                case Handle.BOTTOM: {

                    const parent = this.$el as Element;

                    const height = this.state.mouse.y - this.state.active.position.y;

                    let allowed_height = true;

                    if (height + this.state.active.position.y >= parent.clientHeight - EDGE_PADDING || height <= this.state.active.min.h)
                        allowed_height = false;

                    if (allowed_height) this.state.active.size.h = height;

                    break;
                }

                case Handle.BOTTOM_RIGHT: {

                    const parent = this.$el as Element;

                    const height = this.state.mouse.y - this.state.active.position.y;
                    const width  = this.state.mouse.x - this.state.active.position.x;

                    let allowed_height = true;
                    let allowed_width  = true;

                    if (height + this.state.active.position.y >= parent.clientHeight - EDGE_PADDING || height <= this.state.active.min.h)
                        allowed_height = false;

                    if (width + this.state.active.position.x >= parent.clientWidth - EDGE_PADDING || width <= this.state.active.min.w)
                        allowed_width = false;

                    if (allowed_height) this.state.active.size.h = height;

                    if (allowed_width) this.state.active.size.w = width;

                    break;
                }
            }

            // Move target element around
            else if (this.state.dragging) {

                const parent = this.$el as Element;

                const height = this.state.mouse.y + (this.state.active.size.h / 2);
                const width  = this.state.mouse.x + (this.state.active.size.w / 2);
                const left   = this.state.mouse.x - (this.state.active.size.w / 2);
                const top    = this.state.mouse.y - (this.state.active.size.h / 2);

                let allowed_left = true;
                let allowed_top  = true;

                if (left <= EDGE_PADDING || width >= parent.clientWidth - EDGE_PADDING)
                    allowed_left = false;

                if (top <= EDGE_PADDING || height >= parent.clientHeight - EDGE_PADDING)
                    allowed_top = false;

                if (allowed_left) this.state.active.position.x = left;
                if (allowed_top)  this.state.active.position.y = top;
            }
        },

        /**
         * Handles the mouse click exit event, setting all states to initial.
         */
        handle_up() {

            for (const item of this.data.items) {

                const target: CanvasItemData = this.settingsStore.canvas_items[item.id];

                if (
                    !target                          ||
                    target.x      != item.position.x ||
                    target.y      != item.position.y ||
                    target.height != item.size.h     ||
                    target.width  != item.size.w
                ) {

                    const height = item.size.h;

                    const width = item.size.w;

                    const name = item.id;

                    const x = item.position.x;

                    const y = item.position.y;

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