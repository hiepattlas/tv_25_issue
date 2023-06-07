

window.MyFeed = {
    onReady: function(cb) {
        cb();
    },
    resolveSymbol: function (
        name,
        cb,
    ) {
        axios.get('https://demo-feed-data.tradingview.com/symbols?symbol=' + name)
        .then(({ data }) => cb(data));
    },
    getBars: function (
		symbolInfo,
		resolution,
		periodParams,
		onHistoryCallback,
		onErrorCallback
    ) {
        const {from,to,countBack,firstDataRequest} = periodParams;
        axios.get('https://demo-feed-data.tradingview.com/history', {
            params: {
                from,
                to,
                resolution,
                symbol: symbolInfo.ticker,
                countback: countBack,
            },
        }).then(({ data }) => {
            if (!data.t) {
                return [];
            }
            return data.t.map((t, i) => ({
                time: +t * 1000,
                open: data.o[i],
                high: data.h[i],
                low: data.l[i],
                close: data.c[i],
            }));
        }).then(e => {
            onHistoryCallback(e, {noData: e.length === 0});
        });
    },
    subscribeBars: function (
		symbolInfo,
		resolution,
		onRealtimeCallback,
		subscriberUID,
		onResetCacheNeededCallback
	) {
        if (!window._reset) {
            window._reset = {};
        }
        window._reset[subscriberUID] = onResetCacheNeededCallback;
	},
	unsubscribeBars: (subscriberUID) => {
        if (window._reset) {
            delete window._reset[subscriberUID];
        }
	},
}

window.callOnResetCacheNeededCallback = () => {
    Object.values(window._reset).forEach(e => e());
}