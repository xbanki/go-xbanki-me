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
 * Reset button labels.
 */
enum ResetLabels {
    DEFAULT = 'Revert Changes',
    CONFIRM = 'Confirm?'
}

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
 * Grid state data.
 */
interface ComponentStateSettingsGrid {

    /**
     * Enables the grid snapping.
     * @type {boolean}
     */
    enabled: boolean;

    /**
     * Number of pixels (both in X & Y directions) that make up one grid cell.
     * @type {number}
     */
    step: number;

    /**
     * The center point for the X axis.
     * @type {number | undefined}
     */
    x?: number;

    /**
     * The center point for the Y axis.
     * @type {number | undefined}
     */
    y?: number;
}

/**
 * Settings panel data.
 */
interface ComponentStateSettings {

    /**
     * Grid snapping settings.
     * @type {ComponentStateSettingsGrid}
     */
    grid: ComponentStateSettingsGrid;

    /**
     * Denotes wether or not collisions are enabled.
     * @type {boolean}
     */
    collisions: boolean;

    /**
     * Denotes wether or not the settings component is being panned or not.
     * @type {boolean}
     */
    active: boolean;

    /**
     * Currently active settings panel reset label.
     * @enum {ResetLabels}
     */
    label: ResetLabels;

    /**
     * X position of the settings panel.
     * @type {number}
     */
    x: number;

    /**
     * Y position of the settings panel.
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

    /**
     * Settings panel state data.
     * @type {ComponentStateSettings}
     */
    settings: ComponentStateSettings;
}

/**
 * Component data internal description interface.
 */
interface ComponentData {

    /**
     * An array containing all tracked 
     * @type {Array<TrackedItem>}
     */
    items: TrackedItem[];

    /**
     * Settings panel element.
     * @type {HTMLElement}
     */
    panel?: HTMLElement;
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

// Settings panel drag handle

const SETTINGS_PANEL_DRAG = 'bar-handle';

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

        const mouse_x = 0;

        const mouse_y = 0;

        // Data constants

        const panel = undefined;

        const items: TrackedItem[] = [];

        // Settings panel constants

        const collisions = true;

        const enabled = false;

        const active = false;

        const grid_y = undefined;

        const grid_x = undefined;

        const label = ResetLabels.DEFAULT;

        const step = 16;

        const y = 0;

        const x = 0;

        // Assembled sub-objects

        const mouse: ComponentStateMouse = {
            x: mouse_x,
            y: mouse_y
        };

        const grid: ComponentStateSettingsGrid = {
            x: grid_x,
            y: grid_y,
            enabled,
            step
        };

        const settings: ComponentStateSettings = {
            collisions,
            active,
            label,
            grid,
            x,
            y
        };

        // Populate items with prop data

        if (this.$props.items) for (const item of this.$props.items as DraggableItemRaw[]) {

            const get_initial_positions = (value: number, axis: boolean): number => {

                const get_initial_clock_position = (axis: boolean) => {

                    const target_data = typed_store.state.settingsStore.canvas_items[item.id];

                    if (axis) {

                        const name = item.id;

                        const height = Math.round(target_data.height);
                        const width  = Math.round(target_data.width);

                        const x = Math.round((document.documentElement.clientWidth - width) / 2);
                        const y = Math.round(target_data.y);

                        store.dispatch('settingsStore/UpdateCanvasItem', { name, data: { height, width, x, y }});

                        return x;
                    }

                    const name = item.id;

                    const height = Math.round(target_data.height);
                    const width  = Math.round(target_data.width);

                    const y = Math.round((document.documentElement.clientHeight - height) / 2);
                    const x = Math.round(target_data.x);

                    store.dispatch('settingsStore/UpdateCanvasItem', { name, data: { height, width, x, y }});

                    return y;
                };

                const get_initial_date_position = (axis: boolean) => {

                    const target_data = typed_store.state.settingsStore.canvas_items[item.id];

                    if (axis) {

                        const name = item.id;

                        const height = Math.round(target_data.height);
                        const width  = Math.round(target_data.width);

                        const x = Math.round((document.documentElement.clientWidth - width) / 2);
                        const y = Math.round(target_data.y);

                        store.dispatch('settingsStore/UpdateCanvasItem', { name, data: { height, width, x, y }});

                        return x;
                    }

                    const name = item.id;

                    const height = Math.round(target_data.height);
                    const width  = Math.round(target_data.width);

                    const y = Math.round(((document.documentElement.clientHeight - height) + 64) / 2);
                    const x = Math.round(target_data.x);

                    store.dispatch('settingsStore/UpdateCanvasItem', { name, data: { height, width, x, y }});

                    return y;
                };

                if (value == -1)
                    return get_initial_clock_position(axis);

                if (value == -2)
                    return get_initial_date_position(axis);

                return Math.round(value);
            };

            const target_data = typed_store.state.settingsStore.canvas_items[item.id];

            const id = item.id;

            const min_w = Math.round(item.min?.w ?? 0);
            const min_h = Math.round(item.min?.h ?? 0);

            const h = Math.round(target_data.height);
            const w = Math.round(target_data.width);

            const x = get_initial_positions(target_data.x, true);
            const y = get_initial_positions(target_data.y, false);

            const component = item.component;
            const editable  = item.editable;

            const position =               { x, y };
            const size     =               { w, h };
            const min      = { w: min_w, h: min_h };

            items.push({ component, editable, position, size, min, id });
        }

        // Final state & data objects

        const state: ComponentState = {
            settings,
            resizing,
            dragging,
            mouse,
            edit
        };

        const data: ComponentData = {
            panel,
            items
        };

        return { state, data };
    },

    mounted() {
        document.documentElement.addEventListener('mousedown', this.handle_down, true);
        document.documentElement.addEventListener('mousemove', this.handle_move, true);
        document.documentElement.addEventListener('mouseup',   this.handle_up,   true);

        this.mount_settings_panel();
    },

    methods: {

        mount_settings_panel() {

            if (!this.componentCanvasStore.edit) return;

            this.data.panel = this.$refs.panel as HTMLElement;

            const x = document.documentElement.clientWidth - this.data.panel.clientWidth - EDGE_PADDING;
            const y = (document.documentElement.clientHeight / 2) - (this.data.panel.clientHeight / 2);

            this.state.settings.x = Math.round(x);
            this.state.settings.y = Math.round(y);
        },

        handle_grid(state: boolean) {

            // Set up grid values
            if (state) {

                const y = document.documentElement.clientHeight / 2;
                const x = document.documentElement.clientWidth  / 2;

                this.state.settings.grid.x = Math.round(x);
                this.state.settings.grid.y = Math.round(y);

                this.state.settings.grid.enabled = true;
            }

            // Reset grid instance values
            else {
                this.state.settings.grid.x = undefined;
                this.state.settings.grid.y = undefined;

                this.state.settings.grid.enabled = false;
            }
        },

        handle_down(event: MouseEvent) {

            const target = event.target as HTMLElement;

            if (this.state.edit && target && this.$el.contains(target)) {

                this.state.mouse.x = Math.round(event.clientX);
                this.state.mouse.y = Math.round(event.clientY);

                // Move the dragged thing
                if (target.classList.contains(CLASS_HANDLE_DRAG) && !target.classList.contains(SETTINGS_PANEL_DRAG)) {
                    this.state.dragging = true;

                    if (target.parentElement?.parentElement) for (const item of this.data.items) if (target.parentElement.parentElement.classList.contains(item.id)) {

                        this.state.active = item;

                        break;
                    }
                }

                // Handle settings panel panning
                else if (target.classList.contains(SETTINGS_PANEL_DRAG) && !target.classList.contains(CLASS_HANDLE_DRAG))
                    this.state.settings.active = true;

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

            this.state.mouse.x = Math.round(event.clientX);
            this.state.mouse.y = Math.round(event.clientY);

            if (this.state.active && this.state.resizing) switch(this.state.handle) {

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
                    if (!this.state.settings.collisions || allowed_top) this.state.active.size.h = Math.round(height);
                    if (!this.state.settings.collisions || allowed_top) this.state.active.position.y = Math.round(top);

                    // Horizontal
                    if (!this.state.settings.collisions || allowed_left) this.state.active.size.w = Math.round(width);
                    if (!this.state.settings.collisions || allowed_left) this.state.active.position.x = Math.round(left);

                    break;
                }

                case Handle.TOP: {

                    const height = this.state.active.size.h - (this.state.mouse.y - this.state.active.position.y);
                    const top    = this.state.mouse.y;

                    let allowed_top = true;

                    if (top <= EDGE_PADDING || height <= this.state.active.min.h)
                        allowed_top = false;

                    if (!this.state.settings.collisions || allowed_top) this.state.active.size.h = Math.round(height);
                    if (!this.state.settings.collisions || allowed_top) this.state.active.position.y = Math.round(top);

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

                    if (!this.state.settings.collisions || top <= EDGE_PADDING || height <= this.state.active.min.h)
                        allowed_top = false;

                    if (!this.state.settings.collisions || allowed_right) this.state.active.size.w = Math.round(width);

                    if (!this.state.settings.collisions || allowed_top) this.state.active.size.h = Math.round(height);
                    if (!this.state.settings.collisions || allowed_top) this.state.active.position.y = Math.round(top);

                    break;
                }

                case Handle.LEFT: {

                    const width = this.state.active.size.w - (this.state.mouse.x - this.state.active.position.x);
                    const left  = this.state.mouse.x;

                    let allowed_left = true;

                    if (left <= EDGE_PADDING || width <= this.state.active.min.w)
                        allowed_left = false;

                    if (!this.state.settings.collisions || allowed_left) this.state.active.position.x = Math.round(left);
                    if (!this.state.settings.collisions || allowed_left) this.state.active.size.w = Math.round(width);

                    break;
                }

                case Handle.RIGHT: {

                    const parent = this.$el as Element;

                    const width = this.state.mouse.x - this.state.active.position.x;

                    let allowed_right = true;

                    if (width + this.state.active.position.x >= parent.clientWidth - EDGE_PADDING || width <= this.state.active.min.w)
                        allowed_right = false;

                    if (!this.state.settings.collisions || allowed_right) this.state.active.size.w = Math.round(width);

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

                    if (!this.state.settings.collisions || allowed_height) this.state.active.size.h = Math.round(height);

                    if (!this.state.settings.collisions || allowed_left) this.state.active.position.x = Math.round(left);
                    if (!this.state.settings.collisions || allowed_left) this.state.active.size.w = Math.round(width);

                    break;
                }

                case Handle.BOTTOM: {

                    const parent = this.$el as Element;

                    const height = this.state.mouse.y - this.state.active.position.y;

                    let allowed_height = true;

                    if (height + this.state.active.position.y >= parent.clientHeight - EDGE_PADDING || height <= this.state.active.min.h)
                        allowed_height = false;

                    if (!this.state.settings.collisions || allowed_height) this.state.active.size.h = Math.round(height);

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

                    if (!this.state.settings.collisions || allowed_height) this.state.active.size.h = Math.round(height);

                    if (!this.state.settings.collisions || allowed_width) this.state.active.size.w = Math.round(width);

                    break;
                }
            }

            // Move target element around
            else if (this.state.active && this.state.dragging) {

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

                if (!this.state.settings.collisions || allowed_left) this.state.active.position.x = Math.round(left);
                if (!this.state.settings.collisions || allowed_top)  this.state.active.position.y = Math.round(top);
            }

            // Move settings panel around
            else if (this.state.settings.active) {

                const X_OFFSET = 18;
                const Y_OFFSET = 20;

                this.state.settings.x = Math.round(this.state.mouse.x - X_OFFSET);
                this.state.settings.y = Math.round(this.state.mouse.y - Y_OFFSET);
            }
        },

        handle_up() {

            if (this.state.settings.active)
                this.state.settings.active = false;

            if (this.state.dragging)
                this.state.dragging = false;

            if (this.state.resizing)
                this.state.resizing = false;

            if (this.state.handle)
                this.state.handle = undefined;

            if (this.state.active)
                this.state.active = undefined;
        },

        handle_click_confirm() {

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

            store.commit('componentCanvasStore/UPDATE_EDIT_MODE', false);

            this.$nextTick(() => store.commit('componentSettingsStore/UPDATE_RENDER_STATE', true));
        },

        handle_click_reset() {

            if (this.state.settings.label == ResetLabels.DEFAULT)
                this.state.settings.label = ResetLabels.CONFIRM;

            else if (this.state.settings.label == ResetLabels.CONFIRM) {

                const typed_store = store as Store<{ settingsStore: ModuleState }>;

                for (const item of this.data.items) {

                    const source = typed_store.state.settingsStore.canvas_items[item.id];

                    if (source) {
                        item.position.x = source.x;
                        item.position.y = source.y;

                        item.size.h = source.height;
                        item.size.w = source.width;
                    }
                }

                this.state.settings.label = ResetLabels.DEFAULT;

                store.commit('componentCanvasStore/UPDATE_EDIT_MODE', false);

                this.$nextTick(() => store.commit('componentSettingsStore/UPDATE_RENDER_STATE', true));
            }
        }
    },

    watch: {

        'state.settings.grid.enabled': {

            handler(state: boolean) { if (state) this.handle_grid(state); },

            immediate: true
        },

        'componentCanvasStore.edit': {

            handler() { this.$nextTick(() => this.mount_settings_panel()); },

            immediate: true
        }
    },

    computed: mapState(['eventBusStore', 'settingsStore', 'componentCanvasStore']),

    props: ['items']
});