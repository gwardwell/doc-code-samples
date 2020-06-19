<template>
    <SearchResults :appliedRefinements="appliedRefinements" />
</template>

<script>
import SearchResults from '../components/SearchResults';

export default {
    components: {
        SearchResults,
    },
    data() {
        return {
            appliedRefinements: {
                hitsPerPage: 4,
                disjunctiveFacetsRefinements: { brand: ['Samsung'] },
            },
        };
    },
};
</script>
