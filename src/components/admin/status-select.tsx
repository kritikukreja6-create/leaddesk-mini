"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronDown } from "lucide-react";
import type { ILead } from "@/models/Lead";

type Status = ILead["status"];

const statuses: Status[] = ["New", "Contacted", "Closed"];

const statusStyles: Record<Status, string> = {
  New: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  Contacted: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  Closed: "bg-green-100 text-green-800 hover:bg-green-100",
};

export function StatusSelect({
  leadId,
  status,
  onStatusChange,
}: {
  leadId: string;
  status: Status;
  onStatusChange: (leadId: string, newStatus: Status) => void;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleStatusChange(newStatus: Status) {
    if (newStatus === status) return;

    setIsUpdating(true);

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      onStatusChange(leadId, newStatus);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isUpdating} className="outline-none">
        <Badge
          className={`${statusStyles[status]} cursor-pointer gap-1`}
          variant="secondary"
        >
          {isUpdating ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <>
              {status}
              <ChevronDown className="h-3 w-3" />
            </>
          )}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {statuses.map((s) => (
          <DropdownMenuItem key={s} onClick={() => handleStatusChange(s)}>
            {s}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}