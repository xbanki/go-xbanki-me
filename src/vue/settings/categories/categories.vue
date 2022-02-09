<template>

    <!-- Left-side category section //-->
    <main class="component-categories">

        <!-- Main categories //-->
        <div class="categories-parent" v-for="[parent_category, category_items] of data.items" v-bind:key="data.items.indexOf([parent_category, category_items])">

            <!-- Parent category title display //-->
            <span class="parent-title"> {{ parent_category }} </span>

            <!-- Category icon, name & selector display //-->
            <div class="parent-child" v-for="item of get_category_items(category_items)" v-bind:key="get_category_items(category_items).indexOf(item)"/>
        </div>
    </main>
</template>

<script lang="ts" src="./categories.ts"></script>
<style lang="scss" src="./categories.scss"></style>