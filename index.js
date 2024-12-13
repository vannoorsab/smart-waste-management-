const { BigQuery } = require('@google-cloud/bigquery');

exports.checkBinAvailability = async (req, res) => {
    const bigquery = new BigQuery();
    const datasetId = 'Devicelogs';  // Your dataset ID
    const tableId = 'device_logs';   // Your table ID

    const { device_id, location, timestamp } = req.body;

    try {
        // Query BigQuery to check if a bin is available at the given location and time
        const query = `
            SELECT * FROM \`${datasetId}.${tableId}\`
            WHERE location = @location AND timestamp <= @timestamp
            ORDER BY timestamp DESC
            LIMIT 1
        `;

        const options = {
            query: query,
            params: {
                location: location,
                timestamp: timestamp
            },
        };

        const [rows] = await bigquery.query(options);

        // If no rows are found or the last row shows bin is full, respond accordingly
        if (rows.length === 0) {
            return res.status(200).json({ isAvailable: false, message: "No bin availability data found for this location and timestamp." });
        }

        // Check the status from the query result (assuming 'full' means not available)
        const binStatus = rows[0].status.toLowerCase();

        if (binStatus === 'full') {
            return res.status(200).json({ isAvailable: false, message: "Bin is full." });
        }

        // If the bin is available
        return res.status(200).json({ isAvailable: true, message: "Bin is available." });

    } catch (err) {
        console.error('Error executing BigQuery query:', err);
        return res.status(500).json({ isAvailable: false, message: "Error checking bin availability." });
    }
};