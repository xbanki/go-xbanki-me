<template>

    <!-- Changelog category page root element //-->
    <main class="component-changelog">

        <!-- Changelog component title display //-->
        <span class="changelog-title"> Changelog </span>

        <!-- Latest update changelog item //-->
        <section class="changelog-latest">

            <!-- Rendered Markdown //-->
            <div class="latest-markdown" v-html="state.latest.html"/>

            <!-- Release marker //-->
            <span class="changelog-release"> {{ get_styled_datetime(state.latest.date) }} </span>
        </section>

        <!-- History of older versions //-->
        <section class="changelog-history"/>
    </main>
</template>

<script lang="ts" src="./changelog.ts"></script>
<style lang="scss" src="./changelog.scss" scoped></style>