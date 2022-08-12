import { Store } from 'vuex';

import {  ModuleState } from '@/lib/store_settings';

import store from '@/lib/store';

function get_initial_clock_position(name: string, axis: boolean) {

    const typed_store = store as Store<{ settingsStore: ModuleState }>;

    const target_data = typed_store.state.settingsStore.canvas_items[name];

    if (axis) {

        const height = Math.round(target_data.height);
        const width  = Math.round(target_data.width);

        const x = Math.round((document.documentElement.clientWidth - width) / 2);
        const y = Math.round(target_data.y);

        store.dispatch('settingsStore/UpdateCanvasItem', { name, data: { height, width, x, y }});

        return x;
    }

    const height = Math.round(target_data.height);
    const width  = Math.round(target_data.width);

    const y = Math.round((document.documentElement.clientHeight - height) / 2);
    const x = Math.round(target_data.x);

    store.dispatch('settingsStore/UpdateCanvasItem', { name, data: { height, width, x, y }});

    return y;
}

function get_initial_date_position(name: string, axis: boolean) {

    const typed_store = store as Store<{ settingsStore: ModuleState }>;

    const target_data = typed_store.state.settingsStore.canvas_items[name];

    if (axis) {

        const height = Math.round(target_data.height);
        const width  = Math.round(target_data.width);

        const x = Math.round((document.documentElement.clientWidth - width) / 2);
        const y = Math.round(target_data.y);

        store.dispatch('settingsStore/UpdateCanvasItem', { name, data: { height, width, x, y }});

        return x;
    }

    const height = Math.round(target_data.height);
    const width  = Math.round(target_data.width);

    const y = Math.round((document.documentElement.clientHeight + 64) / 2);
    const x = Math.round(target_data.x);

    store.dispatch('settingsStore/UpdateCanvasItem', { name, data: { height, width, x, y }});

    return y;
}

export default function get_initial_positions(value: number, name: string, axis: boolean): number {

    if (value == -1)
        return get_initial_clock_position(name, axis);

    if (value == -2)
        return get_initial_date_position(name, axis);

    return Math.round(value);
}