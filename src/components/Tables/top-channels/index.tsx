"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getBlockedIPs, addBlockedIP, unblockIP } from "@/services/api.services";

export function TopChannels({ className }: { className?: string }) {
  const [data, setData] = useState<{ ip: string; date: string; time: string }[]>(
    []
  );
  const [ipInput, setIpInput] = useState("");
  const [error, setError] = useState("");

  // Fetch blocked IPs from the backend
  useEffect(() => {
    const fetchBlockedIPs = async () => {
      try {
        const blockedIPs = await getBlockedIPs();
        setData(blockedIPs);
      } catch (err) {
        console.error("Failed to fetch blocked IPs:", err);
      }
    };

    fetchBlockedIPs();
  }, []);

  // Validate IP address format
  const validateIPFormat = (ip: string) => {
    const ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = ip.match(ipPattern);

    if (!match) return false;

    // Validate that each segment is between 0 and 255
    for (let i = 1; i <= 4; i++) {
      const segment = parseInt(match[i], 10);
      if (segment < 0 || segment > 255) return false;
    }

    return true;
  };

  // Function to add a new IP
  const addIP = async () => {
    if (!validateIPFormat(ipInput)) {
      setError(
        "Please enter a valid IP address (format: xxx.xxx.xxx.xxx with values 0-255)"
      );
      return;
    }

    // Check if IP already exists
    if (data.some((item) => item.ip === ipInput)) {
      setError("This IP is already in the block list");
      return;
    }

    try {
      // Call API to add IP
      await addBlockedIP(ipInput);

      // Get current date and time
      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const time = now.toTimeString().split(" ")[0];

      // Add new IP to data
      const newEntry = { ip: ipInput, date, time };
      setData([...data, newEntry]);

      // Clear input and error
      setIpInput("");
      setError("");
    } catch (err) {
      console.error("Failed to add IP:", err);
      setError("Failed to add IP. Please try again.");
    }
  };

  // Handle remove IP
  const removeIP = async (ipToRemove: string) => {
    try {
      // Call API to unblock IP
      await unblockIP(ipToRemove);

      // Remove IP from data
      setData(data.filter((item) => item.ip !== ipToRemove));
    } catch (err) {
      console.error("Failed to unblock IP:", err);
      setError("Failed to unblock IP. Please try again.");
    }
  };

  return (
    <div
      className={cn(
        "grid rounded-lg bg-white px-6 pb-4 pt-6 shadow-md dark:bg-gray-dark",
        className
      )}
    >
      <div className="mb-6">
        <h2 className="mb-4 text-xl font-bold text-dark dark:text-white">
          Blocked IPs
        </h2>

        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="flex-grow">
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="Enter IP address (e.g. 192.168.1.1)"
              className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
          <button
            onClick={addIP}
            className="whitespace-nowrap rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Add IP
          </button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="min-w-[120px] !text-left">IP</TableHead>
            <TableHead>Date-Time</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((entry, i) => (
            <TableRow
              className="text-center text-base font-medium text-dark dark:text-white"
              key={entry.ip + i}
            >
              <TableCell className="!text-left">{entry.ip}</TableCell>
              <TableCell>
                {entry.date} {entry.time}
              </TableCell>
              <TableCell>
                <button
                  onClick={() => removeIP(entry.ip)}
                  className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Unlock
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}