import axios from "axios";

export async function getNetworkTrafficData() {
    try {
        const response = await axios.get("/api/get-traffic");
        return response.data;
    } catch (error) {
        console.log("Failed to fetch network traffic data, returning dummy data:", error);

        // Return dummy data in case of failure
        return {
            traffic: [
                { timestamp: "2023-04-01T00:00:00Z", rate: 10 },
                { timestamp: "2023-04-01T00:00:10Z", rate: 20 },
                { timestamp: "2023-04-01T00:00:20Z", rate: 15 },
                { timestamp: "2023-04-01T00:00:30Z", rate: 25 },
                { timestamp: "2023-04-01T00:00:40Z", rate: 30 },
                { timestamp: "2023-04-01T00:00:50Z", rate: 35 },
                { timestamp: "2023-04-01T00:01:00Z", rate: 40 },
                { timestamp: "2023-04-01T00:01:10Z", rate: 45 },
                { timestamp: "2023-04-01T00:01:20Z", rate: 50 },
                { timestamp: "2023-04-01T00:01:30Z", rate: 55 },
            ],
        };
    }
}



