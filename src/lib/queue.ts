export default class Queue<T> {

    /**
     * `Queue` instance internal elements.
     * @type {Array<T>}
     * @private
     */
    private queue_elements: T[];

    /**
     * Returns all elements still enqueued to this `Queue` instance.
     * @type {Array<T>}
     */
    public get elements(): T[] { return this.queue_elements; }

    /**
     * Returns the number of elements assigned to this `Queue` instance.
     * @type {number}
     */
    public get length(): number { return this.queue_elements.length; }

    /**
     * Returns wether or not this `Queue` instance has no elements assigned to it.
     * @type {boolean}
     */
    public get empty(): boolean { return this.queue_elements.length <= 0; }

    /**
     * Creates new `Queue` instance with optional `elements` pre-bound to the instance.
     * @param {Array<T>} elements - Elements that should be pre-bound to this `Queue` instance
     */
    public constructor(elements?: T[]) { this.queue_elements = elements ?? []; }

    /**
     * Returns the first item from this `Queue` instance, or `undefined` if this instance is empty.
     * @return {T | undefined}
     */
    public Dequeue(): T | undefined { return this.queue_elements.shift(); }

    /**
     * Adds element to this `Queue` instance as the last element in the list.
     * @param {T} element - Element which to add to the queue as last item
     */
    public Enqueue(element: T): void { this.queue_elements.push(element); }
}