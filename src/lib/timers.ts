import config from '@/lib/config';

/**
 * Creates, manages & disposes of timers & groups of timers.
 */
export default class TimerManager {

    // Functions that should be run by the timer functions
    private static timer_group_functions: Map<string, [symbol, (() => void)][]> = new Map();

    // Single timers that have sub-functions to be ran
    private static timer_groups: Map<string, NodeJS.Timer> = new Map();

    /**
     * Creates a new timer in the manager, and returns a reference to it without
     * starting it.
     * @param  {string} name Unique name of the timer group
     * @return {Timer}       Function which should be called to start the timer
     */
    public static AddTimerGroup(name: string, interval: number): void | (() => void) {

        // Make sure we don't override any timers
        if(this.timer_groups.has(name)) {

            if (config.dev_mode) console.warn(`Timer group: ${name} is already present in registry, skipping`);

            return;
        }

        return () => this.timer_groups.set(name, setInterval(() => this.timer_group_functions.get(name)?.forEach(i => i[1]()), interval));
    }

    /**
     * Adds a new function to an existing group to be executed sequentially, with the
     * newest funcitons executed last. Returns unique `Symbol` object which identifies
     * the function, used for removing said function later.
     * @param  {string} group_name Matching name for a timing group, which this
     *                             function will be executed in
     * @param    {void}         fn Callback function itself
     * @return {sumbol}
     */
    public static AddGroupFunction(group_name: string, fn: () => void): symbol {

        // Identifier symbol, which will be used to 
        const id = Symbol();

        // Update already present group functions array
        if (this.timer_group_functions.has(group_name))
            this.timer_group_functions.set(group_name, [...this.timer_group_functions.get(group_name) as [symbol, (() => void)][], [id, fn]]);

        // Set new array, as this is the first function
        else
            this.timer_group_functions.set(group_name, [[id, fn]]);

        return id;
    }

    /**
     * Removes a timer group from the active pool, disposing of any functions that may
     * have been bound to the instance.
     * @param {string} group_name The group which to dispose
     */
    public static RemoveTimerGroup(group_name: string) {

        // Allow only existing groups to be deleted
        if (!this.timer_groups.has(group_name)) {

            if (config.dev_mode) console.error(`Tried to remove non-existent group: ${group_name}`);

            return;
        }

        // Dispose of group functions
        this.timer_group_functions.delete(group_name);

        // Dispose of group itself
        this.timer_groups.delete(group_name);
    }

    /**
     * Removes a function from the active timer group pool, without disposing of the
     * function itself.
     * @param {string} group_name Group name, which to remove the function from
     * @param {symbol}         id Unique identifier (Symbol) of the function
     */
    public static RemoveGroupFunction(group_name: string, id: symbol): void {

        // Make sure we only allow removing functions from groups that actually exist
        if (!this.timer_groups.has(group_name) && !this.timer_group_functions.has(group_name)) {

            if (config.dev_mode) console.error(`Tried to remove group function from a non-existent group: ${group_name}`);

            return;
        }

        const target_group_functions = this.timer_group_functions.get(group_name) as [symbol, (() => void)][];

        for (const [target_id, target_fn] of target_group_functions) {

            if (target_id == id) {
                const index = target_group_functions.indexOf([target_id, target_fn]);

                target_group_functions.splice(index, 1);

                break;
            }

            // Make sure we notify of a function that has not been handled correctly
            else if (target_group_functions.indexOf([target_id, target_fn]) == target_group_functions.length && config.dev_mode)
                console.warn(`Tried to remove function from group: ${group_name}, in which target function does not exist`);
        }
    }
}

export { TimerManager };