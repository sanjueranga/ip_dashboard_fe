"use client";

import { useEffect, useState } from "react";
import { Edit, Check } from "lucide-react";
import { getConfig, updateConfig } from "@/services/api.services";

export default function ConfigCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [algorithm, setAlgorithm] = useState("SHA-256"); // Default algorithm
  const [currentThreshold, setCurrentThreshold] = useState(0);
  const [currentTimeWindow, setCurrentTimeWindow] = useState(0);
  const [currentBlockDuration, setCurrentBlockDuration] = useState(0);
  const [error, setError] = useState("");

  // Fetch configuration data on component mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await getConfig();
        setAlgorithm(config.algorithm || "SHA-256"); // Default to "SHA-256" if not provided
        setCurrentThreshold(config.threshold || 0);
        setCurrentTimeWindow(config.time_window || 0);
        setCurrentBlockDuration(config.block_duration || 0);
      } catch (err) {
        console.error("Failed to fetch configuration:", err);
        setError("Failed to load configuration. Please try again.");
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async () => {
    try {

      await updateConfig(
        currentThreshold,
        currentTimeWindow,
        currentBlockDuration
      );
      setIsEditing(false);
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Failed to save configuration:", err);
      setError("Failed to save configuration. Please try again.");
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg transition-all duration-200 hover:shadow-xl dark:bg-slate-900 dark:shadow-slate-800/20">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Configs</h2>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isEditing
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
              : "bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
          }`}
        >
          {isEditing ? (
            <>
              <Check className="h-4 w-4" />
              <span>Save</span>
            </>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-5 space-y-5">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="group rounded-lg border border-transparent bg-slate-50 p-4 transition-all duration-200 hover:border-slate-200 dark:bg-slate-800/50 dark:hover:border-slate-700">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Current Algorithm
          </p>
          <p className="mt-1.5 text-lg font-semibold text-slate-800 dark:text-white">
            {algorithm}
          </p>
        </div>

        <div
          className={`group rounded-lg border ${
            isEditing ? "border-emerald-500" : "border-transparent"
          } bg-slate-50 p-4 transition-all duration-200 hover:border-slate-200 dark:bg-slate-800/50 dark:hover:border-slate-700`}
        >
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Current Req/Threshold
          </p>
          {isEditing ? (
            <input
              type="number"
              min="0"
              step="0.01"
              value={currentThreshold}
              onChange={(e) => setCurrentThreshold(Number(e.target.value))}
              className="mt-1.5 w-full rounded-lg border border-slate-300 p-2 text-lg font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          ) : (
            <p className="mt-1.5 text-lg font-semibold text-slate-800 dark:text-white">
              {currentThreshold} <span className="text-sm text-slate-500 dark:text-slate-400">req/min</span>
            </p>
          )}
        </div>

        <div
          className={`group rounded-lg border ${
            isEditing ? "border-emerald-500" : "border-transparent"
          } bg-slate-50 p-4 transition-all duration-200 hover:border-slate-200 dark:bg-slate-800/50 dark:hover:border-slate-700`}
        >
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Time Window
          </p>
          {isEditing ? (
            <input
              type="number"
              min="0"
              value={currentTimeWindow}
              onChange={(e) => setCurrentTimeWindow(Number(e.target.value))}
              className="mt-1.5 w-full rounded-lg border border-slate-300 p-2 text-lg font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          ) : (
            <p className="mt-1.5 text-lg font-semibold text-slate-800 dark:text-white">
              {currentTimeWindow} <span className="text-sm text-slate-500 dark:text-slate-400">seconds</span>
            </p>
          )}
        </div>

        <div
          className={`group rounded-lg border ${
            isEditing ? "border-emerald-500" : "border-transparent"
          } bg-slate-50 p-4 transition-all duration-200 hover:border-slate-200 dark:bg-slate-800/50 dark:hover:border-slate-700`}
        >
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Block Duration
          </p>
          {isEditing ? (
            <input
              type="number"
              min="0"
              value={currentBlockDuration}
              onChange={(e) => setCurrentBlockDuration(Number(e.target.value))}
              className="mt-1.5 w-full rounded-lg border border-slate-300 p-2 text-lg font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          ) : (
            <p className="mt-1.5 text-lg font-semibold text-slate-800 dark:text-white">
              {currentBlockDuration} <span className="text-sm text-slate-500 dark:text-slate-400">seconds</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}