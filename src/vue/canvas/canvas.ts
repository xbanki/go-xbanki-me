/**
 * This component is loosely based off of `vue-resizable` by `nikitasnv`:
 *
 *     https://github.com/nikitasnv/vue-resizable
 */

import { mapState }                   from 'vuex';
import { Component, defineComponent } from 'vue';

import componentDraggable from './draggable/draggable.vue';

export type DraggableItemRaw = { component: Component, editable: boolean };

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
     * Currently active dragged element.
     * @type {HTMLElement}
     */
    el?: HTMLElement;

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

        if (this.$props.items) for (const item of this.$props.items as { component: Component, editable: boolean }[]) {

            // @TODO(xbanki): Get the X & Y values from storage!
            const x = 16;
            const y = 16;

            //@TODO (xbanki): Same with width & height.
            const w = 32;
            const h = 32;

            const component = item.component;
            const editable  = item.editable;

            items.push({ component, editable, x, y, w, h });
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

                    if (target.parentElement?.parentElement)
                        this.state.el = target.parentElement?.parentElement;
                }

                // Resize whatever we're handling right now
                else for (let i = 0; i < target.classList.length; i++) {

                    const target_class = target.classList[i] as Handle;

                    if (!target_class || !ALLOWED_SCALE_CLASSES.includes(target_class)) continue;

                    if (target.parentElement?.parentElement)
                        this.state.el = target.parentElement?.parentElement;

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

            /**
             * Returns `value` param in CSS pixel string.
             */
            const get_pixels = (value: number) => `${value}px`;

            // Do nothing if we don't have a target element
            if (!this.state.el) return;

            this.state.mouse.x = event.clientX;
            this.state.mouse.y = event.clientY;

            if (this.state.resizing) switch(this.state.handle) {

                case Handle.TOP_LEFT:
                    break;

                case Handle.TOP:
                    break;

                case Handle.TOP_RIGHT:
                    break;

                case Handle.LEFT:
                    break;

                case Handle.RIGHT:
                    break;

                case Handle.BOTTOM_LEFT:
                    break;

                case Handle.BOTTOM:
                    break;

                case Handle.BOTTOM_RIGHT:
                    break;
            }

            // Move target element around
            else if (this.state.dragging) {

                const left_offset = this.state.el.clientWidth / 2;
                const top_offset  = this.state.el.clientHeight / 2;

                const left = get_x(this.state.mouse.x - left_offset);
                const top = get_y(this.state.mouse.y - top_offset);

                this.state.el.style.left = get_pixels(left);
                this.state.el.style.top = get_pixels(top);
            }
        },

        /**
         * Handles the mouse click exit event, setting all states to initial.
         */
        handle_up() {
            if (this.state.dragging)
                this.state.dragging = false;

            if (this.state.resizing)
                this.state.resizing = false;

            if (this.state.handle)
                this.state.handle = undefined;

            if (this.state.el)
                this.state.el = undefined;
        }
    },

    computed: mapState(['eventBusStore']),

    props: ['items']
});