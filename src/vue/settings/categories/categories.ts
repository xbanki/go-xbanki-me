import { defineComponent } from 'vue';

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
    items: [[string, CategoryItem[]]];
}

export default defineComponent({

    data() { return { internal_state: { preloaded_icons: false } }; },

    mounted() { this.$nextTick(() => { if (this.data?.items && this.data.items.length >= 1) this.preload_category_icons(this.data.items); }); },

    methods: {
        preload_category_icons(items: [[string, CategoryItem[]]]) {

            // @TO-DO(xbanki): Load icons!

            if (!this.internal_state.preloaded_icons) {
                this.internal_state.preloaded_icons = true;
                this.$emit('ready');
            }
        }
    },

    watch: {

        /**
         * Loads all category icons ahead of time, emitting the ready event once we have loaded all of them.
         */
        'data.items': {
            handler(state: [[string, CategoryItem[]]]) { this.preload_category_icons(state); },

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