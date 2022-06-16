<template>

    <!-- Time display category page root element //-->
    <main class="component-time-display">

        <!-- Time Display component title display //-->
        <span class="time-display-title"> Time Display </span>

        <!-- Updated clock display //-->
        <section class="time-display-example">

            <!-- Clock example, which is static //-->
            <span class="example-display"> {{ state.display.time }} </span>
        </section>

        <!-- Clock display format //-->
        <section class="time-display-format">

            <!-- Upper "non-active" format rail //-->
            <div class="format-upper">

                <!-- VueDraggable based dragging container //-->
                <draggable

                    v-bind:component-data="{
                        type: 'transition-group',
                        tag: 'ul'
                    }"

                    v-bind="{
                        ghostClass: 'dragging',
                        group: 'time-format',
                        animation: 120
                    }"


                    v-on:start="state.dragging = true"

                    v-on:end="state.dragging = false"

                    v-on:change="handle_drag_event"

                    v-model="state.format.inactive"

                    class="upper-group"

                    item-key="index"

                >

                    <!-- VueDraggable based dragging container //-->
                    <template v-slot:item="{ element }">

                        <li class="group-item delimiter" v-if="element?.delimiter">

                            <!-- Delimiter format item //-->
                            {{ get_delimiter(state.format.delimiter) }}
                        </li>

                        <li class="group-item option" v-else>

                            <!-- Format option item //-->
                            {{ state.display[element.token] }}
                        </li>
                    </template>
                </draggable>
            </div>

            <!-- Upper "active" format rail //-->
            <div class="format-lower">

                <!-- VueDraggable based dragging container //-->
                <draggable

                    v-bind:component-data="{
                        type: 'transition-group',
                        tag: 'ul'
                    }"

                    v-bind="{
                        ghostClass: 'dragging',
                        group: 'time-format',
                        animation: 120
                    }"


                    v-on:start="state.dragging = true"

                    v-on:end="state.dragging = false"

                    v-model="state.format.inactive"

                    class="lower-group"

                    item-key="index"

                >

                    <!-- VueDraggable based dragging container //-->
                    <template v-slot:item="{ element }">

                        <li class="group-item delimiter" v-if="element?.delimiter">

                            <!-- Delimiter format item //-->
                            {{ get_delimiter(state.format.delimiter) }}
                        </li>

                        <li class="group-item option" v-else>

                            <!-- Format option item //-->
                            {{ state.display[element.token] }}
                        </li>
                    </template>
                </draggable>
            </div>
        </section>
    </main>
</template>

<script lang="ts" src="./time_display.ts"></script>
<style lang="scss" src="./time_display.scss" scoped></style>