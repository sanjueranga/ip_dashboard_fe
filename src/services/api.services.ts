import axios from "axios";

// Fetch last 10 seconds traffic rate
export async function getNetworkTrafficData() {
  try {
    const response = await axios.get("/telemetry/traffic");
    return {
      traffic: response.data.rate || 0,
      timestamp: response.data.timestamp || "",
    };
  } catch (error) {
    console.log("Failed to fetch network traffic data, returning dummy data:", error);

    // Return dummy data in case of failure
    return {
      traffic: 0,
      timestamp: "2025-05-02 00:00:00",
    };
  }
}

// Fetch overview data (traffic, users, blocked IPs, allowed users)
export async function getOverviewData() {
  try {
    const trafficResponse = await axios.get("/telemetry/traffic");
    const ipHitsResponse = await axios.get("/telemetry/ip-hits");
    const blockedIPsResponse = await axios.get("/telemetry/blocked");

    const traffic = trafficResponse.data.rate || 0;
    const users = Object.keys(ipHitsResponse.data.ip_hits_last_minute).length || 0;
    const blockedIPs = blockedIPsResponse.data.blocked_ips.length || 0;
    const allowedUsers = users - blockedIPs;

    return {
      traffic,
      users,
      blockedIPs,
      allowedUsers,
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

// Fetch top IP hits (last 60 seconds, sorted by hit count descending)
export async function getTopClients() {
  try {
    const response = await axios.get("/telemetry/ip-hits");
    const ipHits = response.data.ip_hits_last_minute || {};

    // Convert to array and sort by count descending
    const sortedHits = Object.entries(ipHits)
      .map(([ip, count]) => ({ name: ip, count: count as number }))
      .sort((a: { name: string; count: number }, b: { name: string; count: number }) => b.count - a.count);

    return sortedHits;
  } catch (error) {
    console.log("Failed to fetch top clients data, returning dummy data:", error);

    // Return dummy data in case of failure
    return [
      { name: "127.0.0.1", count: 10 },
      { name: "192.168.1.1", count: 8 },
      { name: "10.0.0.1", count: 5 },
    ];
  }
}

// Fetch blocked IPs with time
export async function getBlockedIPs() {
  try {
    const response = await axios.get("/telemetry/blocked");
    return response.data.blocked_ips || [];
  } catch (error) {
    console.log("Failed to fetch blocked IPs data, returning dummy data:", error);

    // Return dummy data in case of failure
    return [
      { ip: "192.168.1.1", blocked_since: "2025-05-02 00:00:00" },
      { ip: "10.0.0.1", blocked_since: "2025-05-02 00:05:00" },
    ];
  }
}

// Add a blocked IP
export async function addBlockedIP(ip: string) {
  try {
    const response = await axios.post("/control/block", { ip });
    return response.data;
  } catch (error) {
    console.error("Failed to add blocked IP:", error);
    throw error;
  }
}

// Unblock an IP
export async function unblockIP(ip: string) {
  try {
    const response = await axios.post("/control/unblock", { ip });
    return response.data;
  } catch (error) {
    console.error("Failed to unblock IP:", error);
    throw error;
  }
}

// Fetch current server configuration (only threshold is used in the frontend)
export async function getConfig() {
  try {
    const response = await axios.get("/telemetry/config");
    return response.data.config || {};
  } catch (error) {
    console.log("Failed to fetch server configuration, returning dummy data:", error);

    // Return dummy data in case of failure
    return {
      threshold: 100,
      time_window: 10,
      block_duration: 300,
    };
  }
}

// Update server configuration (only threshold is sent)
export async function updateConfig(threshold: number, time_window: number, block_duration: number) {
  try {
    const response = await axios.post("/control/config", { threshold });
    return response.data;
  } catch (error) {
    console.error("Failed to update configuration:", error);
    throw error;
  }
}