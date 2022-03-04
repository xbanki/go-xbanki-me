<template>

    <!-- Appearance pages root element //-->
    <main class="component-appearance">

        <!-- Appearance pages titlebar //-->
        <section class="appearance-bar">

            <!-- Appearance title display itself //-->
            <span class="bar-title"> Appearance </span>
        </section>

        <!-- Appearance pages content wrapper //-->
        <section class="appearance-content">

            <!-- Application theme option section //-->
            <div class="content-item">
                <theme-page-component/>
            </div>

            <!-- Application background fit style //-->
            <div class="content-item">
                <background-fit-page-component/>
            </div>
        </section>
    </main>
</template>

<script lang="ts" src="./appearance.ts"></script>
<style lang="scss" src="./appearance.scss" scoped></style>