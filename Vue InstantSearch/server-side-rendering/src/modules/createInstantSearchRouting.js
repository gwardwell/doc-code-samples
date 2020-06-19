import qs from 'qs';

// const routeStateQueryString = routeState => {
//     const queryParameters = {};
//     if (routeState.page && routeState.page !== 1) {
//         queryParameters.page = routeState.page;
//     }
//     if (routeState.query) {
//         queryParameters.query = encodeURIComponent(routeState.query);
//     }
//     if (routeState.sortBy) {
//         queryParameters.sortBy = encodeURIComponent(routeState.sortBy);
//     }
//     const refinements = filterRefinements(routeState);
//     if (Object.keys(refinements).length) {
//         const key = Object.keys(refinements)[0];
//         queryParameters[key] = refinements[key].map(encodeURIComponent);
//     }
//     // console.log(queryParameters)
//     const url = qs.stringify(queryParameters, {
//         addQueryPrefix: true,
//         arrayFormat: 'repeat',
//     });
//     console.log(`server: "${url}"`);
//     return url;
// };

const filterRefinements = ({ page, query, sortBy, ...refinements } = {}) =>
    refinements;

export default context => ({
    router: {
        read() {
            const url = context
                ? context.url
                : typeof window.location === 'object'
                ? window.location.href
                : '';
            const search = url.slice(url.indexOf('?'));

            return qs.parse(search, {
                ignoreQueryPrefix: true,
            });
        },
        write(routeState) {
            const query = qs.stringify(routeState, {
                addQueryPrefix: true,
                arrayFormat: 'repeat',
            });

            if (typeof history === 'object') {
                history.pushState(routeState, null, query);
            }
        },
        createURL(routeState) {
            const query = qs.stringify(routeState, {
                addQueryPrefix: true,
                arrayFormat: 'repeat',
            });

            return query;
            // return routeStateQueryString(routeState);
        },
        onUpdate(callback) {
            if (typeof window !== 'object') {
                return;
            }
            // TODO: handle vue route changes
            this._onPopState = event => {
                if (this.writeTimer) {
                    window.clearTimeout(this.writeTimer);
                    this.writeTimer = undefined;
                }

                const routeState = event.state;

                // At initial load, the state is read from the URL without update.
                // Therefore the state object is not available.
                // In this case, we fallback and read the URL.
                if (!routeState) {
                    callback(this.read());
                } else {
                    callback(routeState);
                }
            };

            window.addEventListener('popstate', this._onPopState);
        },
        dispose() {
            if (this._onPopState && typeof window == 'object') {
                window.removeEventListener('popstate', this._onPopState);
            }

            // we purposely don't write on dispose, to prevent double entries on navigation
            // TODO: this should be an option in the real router
        },
    },
    stateMapping: {
        routeToState(routeState) {
            console.log(routeState);
            const refinementList = {};
            if (routeState) {
                const refinements = filterRefinements(routeState);
                const refinementArr = Object.keys(refinements);
                const refinementLength = refinementArr.length;
                let i = 0;
                for (; i < refinementLength; i++) {
                    const key = refinementArr[i];
                    if (!refinements[key]) continue;
                    refinementList[key] =
                        typeof refinements[key] === 'string'
                            ? new Array(refinements[key])
                            : refinements[key];
                    refinementList[key].map(decodeURIComponent);
                }
            }
            return {
                instant_search: {
                    page: routeState.page,
                    query: routeState.query,
                    sortBy: routeState.sortBy,
                    refinementList,
                },
            };
        },
        stateToRoute(uiState) {
            const indexUiState = uiState.instant_search || {};
            const refinementList = {};
            if (indexUiState && indexUiState.refinementList) {
                const refinementArr = Object.keys(indexUiState.refinementList);
                const refinementLength = refinementArr.length;
                let i = 0;
                for (; i < refinementLength; i++) {
                    const key = refinementArr[i];
                    refinementList[key] = indexUiState.refinementList[key];
                }
            }
            return {
                page: indexUiState.page,
                query: indexUiState.query,
                sortBy:
                    indexUiState.sortBy === 'instant_search'
                        ? undefined
                        : indexUiState.sortBy,
                ...refinementList,
            };
        },
    },
});
