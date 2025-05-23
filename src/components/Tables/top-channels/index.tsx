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
  const [showConfirm, setShowConfirm] = useState(false);
  const [showUnblockConfirm, setShowUnblockConfirm] = useState(false);
  const [ipToBlock, setIpToBlock] = useState("");
  const [ipToUnblock, setIpToUnblock] = useState("");

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

      // Fetch data initially and every 10 seconds
      fetchBlockedIPs();
      const interval = setInterval(fetchBlockedIPs, 10000);

      return () => clearInterval(interval); // Cleanup interval on component unmount
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
  const confirmAddIP = () => {
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

    // Show confirmation popup
    setIpToBlock(ipInput);
    setShowConfirm(true);
  };

  const addIP = async () => {
    try {
      // Call API to add IP
      await addBlockedIP(ipToBlock);

      // Get current date and time
      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const time = now.toTimeString().split(" ")[0];

      // Add new IP to data
      const newEntry = { ip: ipToBlock, date, time };
      setData([...data, newEntry]);

      // Clear input and error
      setIpInput("");
      setError("");
      setShowConfirm(false);
    } catch (err) {
      console.error("Failed to add IP:", err);
      setError("Failed to add IP. Please try again.");
    }
  };

  // Function to confirm unblocking an IP
  const confirmUnblockIP = (ip: string) => {
    setIpToUnblock(ip);
    setShowUnblockConfirm(true);
  };

  const unblockIPHandler = async () => {
    try {
      // Call API to unblock IP
      await unblockIP(ipToUnblock);

      // Remove IP from data
      setData(data.filter((item) => item.ip !== ipToUnblock));
      setShowUnblockConfirm(false);
    } catch (err) {
      console.error("Failed to unblock IP:", err);
      setError("Failed to unblock IP. Please try again.");
    }
  };

  return (
    <div
      className={cn(
        "grid rounded-lg bg-white px-6  pt-6 shadow-md dark:bg-gray-dark",
        className
      )}
    >
      <div className="">
        <h2 className="mb-8 text-xl font-bold text-dark dark:text-white">
          Blocked IPs
        </h2>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 mb-4">
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
          <div>
            <button
              onClick={confirmAddIP}
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
            {data.length > 0 ? (
              data.map((entry, i) => (
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
                      onClick={() => confirmUnblockIP(entry.ip)}
                      className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                      Unlock
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-10 text-center text-gray-500 dark:text-gray-400"
                >
                  No blocked IPs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Popup for Blocking */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
              Confirm Block
            </h3>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to block the IP: <strong>{ipToBlock}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={addIP}
                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Popup for Unblocking */}
      {showUnblockConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
              Confirm Unblock
            </h3>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to unblock the IP: <strong>{ipToUnblock}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowUnblockConfirm(false)}
                className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={unblockIPHandler}
                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}