"use client";

import { useState } from "react";
import { Edit, Check } from "lucide-react";
import { updateConfig } from "@/services/api.services";

interface ConfigCardProps {
  algorithm: string;
  threshold: string;
}

export default function ConfigCard({
  algorithm = "SHA-256",
  threshold = "0.75",
}: ConfigCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState(algorithm);
  const [currentThreshold, setCurrentThreshold] = useState(threshold);
  const [error, setError] = useState("");

  const handleSave = async () => {
    try {
      // Call API to update configuration
      await updateConfig(currentAlgorithm, currentThreshold);
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
        <div
          className={`group rounded-lg border ${
            isEditing ? "border-emerald-500" : "border-transparent"
          } bg-slate-50 p-4 transition-all duration-200 hover:border-slate-200 dark:bg-slate-800/50 dark:hover:border-slate-700`}
        >
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Current Algorithm
          </p>
          {isEditing ? (
            <input
              type="text"
              value={currentAlgorithm}
              onChange={(e) => setCurrentAlgorithm(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 p-2 text-lg font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          ) : (
            <p className="mt-1.5 text-lg font-semibold text-slate-800 dark:text-white">
              {currentAlgorithm}
            </p>
          )}
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
              type="text"
              value={currentThreshold}
              onChange={(e) => setCurrentThreshold(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 p-2 text-lg font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          ) : (
            <p className="mt-1.5 text-lg font-semibold text-slate-800 dark:text-white">
              {currentThreshold} <span className="text-sm text-slate-500 dark:text-slate-400">req/min</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}