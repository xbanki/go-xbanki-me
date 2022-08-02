<template>
    <main class="component-canvas">
        <component-draggable

            v-bind:style="{

                'height': `${item.h}px`,

                'width': `${item.w}px`,

                'left': `${item.x}px`,

                'top': `${item.y}px`

            }"

            v-bind:scaleable="item.editable"

            v-for="item of data.items"
        
            v-bind:key="item.id"
        >

            <!-- Binds component to the draggable content slot //-->
            <component v-bind:is="item.component"/>

        </component-draggable>
    </main>
</template>

<script lang="ts" src="./canvas.ts"></script>
<style lang="scss" src="./canvas.scss"></style>