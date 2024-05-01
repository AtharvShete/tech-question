// Function to fetch and process stock price data
async function fetchStockData() {
    const apiUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&month=2009-01&outputsize=full&apikey=demo'; // Replace with your API endpoint
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data || !data['Time Series (5min)']) {
            throw new Error('Invalid stock data format');
        }

        return data['Time Series (5min)'];
    } catch (error) {
        console.error('Error fetching stock data:', error.message);
        return null;
    }
}

// Function to render stock price chart using Plotly.js
async function renderStockChart() {
    const intervalSelect = document.getElementById('intervalSelect');
    const selectedInterval = intervalSelect.value;

    const timeSeries = await fetchStockData();

    if (!timeSeries) {
        console.log('Failed to retrieve stock data.');
        return;
    }

    const timestamps = Object.keys(timeSeries);
    const openPrices = timestamps.map(timestamp => parseFloat(timeSeries[timestamp]['1. open']));
    const closePrices = timestamps.map(timestamp => parseFloat(timeSeries[timestamp]['4. close']));

    const traceOpen = {
        type: 'scatter',
        mode: 'lines',
        name: 'Open Price',
        x: timestamps,
        y: openPrices,
        line: { color: 'blue' }
    };

    const traceClose = {
        type: 'scatter',
        mode: 'lines',
        name: 'Close Price',
        x: timestamps,
        y: closePrices,
        line: { color: 'green' }
    };

    const layout = {
        title: `Stock Price Chart (${selectedInterval} Aggregation)`,
        xaxis: { title: 'Timestamp' },
        yaxis: { title: 'Price' }
    };

    const chartData = [traceOpen, traceClose];
    Plotly.newPlot('chartContainer', chartData, layout);
}

// Initial chart rendering on page load
renderStockChart();
