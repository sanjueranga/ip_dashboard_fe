import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { compactFormat, standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { getIPs } from "../fetch";

export async function TopChannels({ className }: { className?: string }) {
  const data = await getIPs();
  console.log("data :", data);

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex h-10 justify-between">
        {" "}
        <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
          Top Channels
        </h2>
        <button className="rounded bg-green-500 px-4 text-white hover:bg-green-600">
          Add IP
        </button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="min-w-[120px] !text-left">IP</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
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
              <TableCell>{entry.date}</TableCell>
              <TableCell>{entry.time}</TableCell>
              <TableCell>
                <button className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
                  Block
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
