<template>
    <ais-instant-search-ssr>
        <ais-configure v-bind.camel="appliedRefinements" />
        <ais-search-box />
        <ais-stats />
        <ais-refinement-list attribute="brand">
            <!-- <template slot-scope="{ items, createURL, refine }">
                <div v-for="item in items" :key="item.value">
                    <a
                        :href="createURL(item.value)"
                        @click.prevent="refine(item.value)"
                    >
                        {{ item.label }}
                    </a>
                </div>
            </template>-->
        </ais-refinement-list>
        <ais-sort-by
            :items="[
                { value: 'instant_search', label: 'Featured' },
                {
                    value: 'instant_search_price_asc',
                    label: 'Price: Low to High',
                },
                {
                    value: 'instant_search_price_desc',
                    label: 'Price: High to Low',
                },
            ]"
        />
        <ais-hits>
            <template slot="item" slot-scope="{ item }">
                <p>
                    <ais-highlight attribute="name" :hit="item" />
                </p>
                <p>
                    <ais-highlight attribute="brand" :hit="item" />
                </p>
            </template>
        </ais-hits>
        <ais-pagination />
    </ais-instant-search-ssr>
</template>

<script>
import {
    AisConfigure,
    AisSortBy,
    AisInstantSearchSsr,
    AisRefinementList,
    AisHits,
    AisHighlight,
    AisSearchBox,
    AisStats,
    AisPagination,
} from 'vue-instantsearch';

export default {
    components: {
        AisConfigure,
        AisSortBy,
        AisInstantSearchSsr,
        AisRefinementList,
        AisHits,
        AisHighlight,
        AisSearchBox,
        AisStats,
        AisPagination,
    },
    props: {
        appliedRefinements: {
            type: Object,
            required: false,
            default: () => ({}),
        },
    },
};
</script>

<style></style>
