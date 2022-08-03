<template>
    <main class="component-canvas">
        <component-draggable

            v-bind:style="{

                'left': `${item.position.x}px`,

                'top': `${item.position.y}px`,

                'height': `${item.size.h}px`,

                'width': `${item.size.w}px`

            }"


            v-bind:scaleable="item.editable"

            v-for="item of data.items"

            v-bind:class="item.id"
        
            v-bind:key="item.id"
        >

            <!-- Binds component to the draggable content slot //-->
            <component v-bind:is="item.component"/>

        </component-draggable>
    </main>
</template>

<script lang="ts" src="./canvas.ts"></script>
<style lang="scss" src="./canvas.scss"></style>