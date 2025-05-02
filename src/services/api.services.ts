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

export async function getOverviewData() {
    try {
        const response = await axios.get("/api/overview");
        return {
            traffic: response.data.traffic || 0,
            users: response.data.users || 0,
            blockedIPs: response.data.blockedIPs || 0,
            allowedUsers: response.data.allowedUsers || 0,
        };
    } catch (error) {
        console.log("Failed to fetch overview data, returning dummy data:", error);

        // Return dummy data in case of failure
        return {
            traffic: 3456,
            users: 1234,
            blockedIPs: 56,
            allowedUsers: 789,
        };
    }
}
export async function getTopClients() {
    try {
        const response = await axios.get("/api/top-clients");
        return response.data;
    } catch (error) {
        console.log("Failed to fetch top clients data, returning dummy data:", error);

        // Return dummy data in case of failure
        return [
            { name: "Sat", count: 44 },
            { name: "Sun", count: 55 },
            { name: "Mon", count: 41 },
            { name: "Tue", count: 67 },
            { name: "Wed", count: 22 },
            { name: "Thu", count: 43 },
            { name: "Fri", count: 65 },
        ];
    }
}


export async function getBlockedIPs() {
    try {
        const response = await axios.get("/api/get-blocked-ips");
        return response.data;
    } catch (error) {
        console.log("Failed to fetch blocked IPs data, returning dummy data:", error);

        // Return dummy data in case of failure
        return [
            { ip: "192.168.1.1", date: "2025-04-28", time: "14:30:45" },
            { ip: "10.0.0.1", date: "2025-04-28", time: "12:15:22" },
        ];
    }
}


// Function to add a blocked IP
export async function addBlockedIP(ip: string) {
  try {
    const response = await axios.post("/api/blocked-ips", { ip });
    return response.data;
  } catch (error) {
    console.error("Failed to add blocked IP:", error);
    throw error;
  }
}

// Function to unblock an IP
export async function unblockIP(ip: string) {
  try {
    const response = await axios.delete(`/api/blocked-ips/${ip}`);
    return response.data;
  } catch (error) {
    console.error("Failed to unblock IP:", error);
    throw error;
  }
}

export async function updateConfig( threshold: number) {
  try {
    const response = await axios.post("/api/config", {  threshold });
    return response.data;
  } catch (error) {
    console.error("Failed to update configuration:", error);
    throw error;
  }
}