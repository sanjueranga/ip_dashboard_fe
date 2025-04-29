"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Mock data for demonstration
const initialData = [
  { ip: "192.168.1.1", date: "2025-04-28", time: "14:30:45" },
  { ip: "10.0.0.1", date: "2025-04-28", time: "12:15:22" },
];

export function TopChannels({ className }: { className?: string }) {
  const [data, setData] = useState(initialData);
  const [ipInput, setIpInput] = useState("");
  const [error, setError] = useState("");

  // Validate IP address format
  const validateIPFormat = (ip:string) => {
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
  const addIP = () => {
    if (!validateIPFormat(ipInput)) {
      setError("Please enter a valid IP address (format: xxx.xxx.xxx.xxx with values 0-255)");
      return;
    }
    
    // Check if IP already exists
    if (data.some(item => item.ip === ipInput)) {
      setError("This IP is already in the block list");
      return;
    }
    
    // Get current date and time
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];
    
    // Add new IP to data
    const newEntry = { ip: ipInput, date, time };
    setData([...data, newEntry]);
    
    // Clear input and error
    setIpInput("");
    setError("");
  };

  // Handle remove IP
  const removeIP = (ipToRemove: string) => {
    setData(data.filter(item => item.ip !== ipToRemove));
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
              <TableCell>{entry.date} {entry.time}</TableCell>
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