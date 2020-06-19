import Vue from 'vue';
import App from './App.vue';
import { createRouter } from './router';
import { createServerRootMixin } from 'vue-instantsearch';
import algoliasearch from 'algoliasearch/lite';
import createInstantSearchRouting from './modules/createInstantSearchRouting';

const searchClient = algoliasearch(
    'latency',
    '6be0576ff61c053d5f9a3225e2a90f76',
);

Vue.config.productionTip = false;

export async function createApp({
    beforeApp = () => {},
    afterApp = () => {},
    context,
} = {}) {
    const router = createRouter();

    await beforeApp({
        router,
    });

    const app = new Vue({
        mixins: [
            createServerRootMixin({
                indexName: 'instant_search',
                searchClient,
                routing: createInstantSearchRouting(context),
            }),
        ],
        serverPrefetch() {
            return this.instantsearch.findResultsState(this);
        },
        beforeMount() {
            if (typeof window === 'object' && window.__ALGOLIA_STATE__) {
                this.instantsearch.hydrate(window.__ALGOLIA_STATE__);
                delete window.__ALGOLIA_STATE__;
            }
        },
        router,
        render: h => h(App),
    });

    const result = {
        app,
        router,
    };

    await afterApp(result);

    return result;
}
