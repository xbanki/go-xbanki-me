<template>

    <!-- Miscellaneous pages root element //-->
    <main class="component-miscellaneous">

        <!-- Miscellaneous pages titlebar //-->
        <section class="miscellaneous-bar">

            <!-- Miscellaneous title display itself //-->
            <span class="bar-title"> Miscellaneous </span>
        </section>

        <!-- Miscellaneous pages content wrapper //-->
            <section class="miscellaneous-content">

                <!-- Application changelog option section //-->
                <div class="content-item">
                    <changelog-page-component/>
                </div>

                <!-- Privacy & safety statement option section //-->
                <div class="content-item">
                    <privacy-and-safety-page-component/>
                </div>

                <!-- User persisted data delete option section //-->
                <div class="content-item">
                    <delete-data-page-component/>
                </div>
            </section>
    </main>
</template>

<script lang="ts" src="./miscellaneous.ts"></script>
<style lang="scss" src="./miscellaneous.scss" scoped></style>