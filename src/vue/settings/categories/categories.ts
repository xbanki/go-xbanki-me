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
    }
});