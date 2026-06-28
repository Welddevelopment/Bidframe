"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Position,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useRequirements } from "@/context/RequirementsContext";
import type { Requirement } from "@/types/requirement";

const REQ_COLUMN_X = 40;
const CRITERIA_COLUMN_X = 520;
const ROW_GAP = 92;

// Brand palette: red = deal-breaker (gating), amber = needs review, slate = default.
function nodeStyle(req: Requirement): React.CSSProperties {
  if (req.is_gating) {
    return {
      background: "#fef2f2",
      border: "1px solid #ef4444",
      color: "#7f1d1d",
    };
  }
  if (req.needs_review) {
    return {
      background: "#fffbeb",
      border: "1px dashed #f59e0b",
      color: "#78350f",
    };
  }
  return {
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    color: "#334155",
  };
}

const baseNodeStyle: React.CSSProperties = {
  borderRadius: 12,
  padding: "8px 12px",
  fontSize: 12,
  lineHeight: 1.3,
  width: 240,
  boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
};

const criteriaNodeStyle: React.CSSProperties = {
  ...baseNodeStyle,
  width: 200,
  background: "#f8fafc",
  border: "1px solid #94a3b8",
  color: "#475569",
  fontWeight: 600,
};

function truncate(text: string, max = 90): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

function prettyCriterion(ref: string): string {
  return ref
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function GraphView() {
  const { requirements } = useRequirements();

  const { nodes, edges } = useMemo(() => {
    const reqIds = new Set(requirements.map((r) => r.id));

    // Requirement nodes — left column, stepped vertically.
    const reqNodes: Node[] = requirements.map((req, i) => ({
      id: req.id,
      position: { x: REQ_COLUMN_X, y: i * ROW_GAP },
      data: { label: truncate(req.text) },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: { ...baseNodeStyle, ...nodeStyle(req) },
    }));

    // Distinct, non-null criteria_ref nodes — right column.
    const criteriaRefs = Array.from(
      new Set(
        requirements
          .map((r) => r.criteria_ref)
          .filter((ref): ref is string => ref !== null)
      )
    );
    const criteriaNodes: Node[] = criteriaRefs.map((ref, i) => ({
      id: `crit:${ref}`,
      position: { x: CRITERIA_COLUMN_X, y: i * ROW_GAP * 1.6 + ROW_GAP },
      data: { label: prettyCriterion(ref) },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: criteriaNodeStyle,
    }));

    const graphEdges: Edge[] = [];

    for (const req of requirements) {
      // Requirement -> its award criterion (solid).
      if (req.criteria_ref) {
        graphEdges.push({
          id: `${req.id}->crit:${req.criteria_ref}`,
          source: req.id,
          target: `crit:${req.criteria_ref}`,
          style: {
            stroke: req.is_gating ? "#ef4444" : "#94a3b8",
            strokeWidth: req.is_gating ? 2 : 1.25,
          },
        });
      }

      // Requirement -> requirement dependency (dashed + animated, distinct look).
      for (const depId of req.depends_on) {
        if (!reqIds.has(depId)) continue;
        graphEdges.push({
          id: `${req.id}--depends--${depId}`,
          source: req.id,
          target: depId,
          animated: true,
          style: {
            stroke: "#6366f1",
            strokeWidth: 1.5,
            strokeDasharray: "6 4",
          },
        });
      }
    }

    return { nodes: [...reqNodes, ...criteriaNodes], edges: graphEdges };
  }, [requirements]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 px-4 py-2.5 text-xs text-slate-600">
        <span className="font-medium text-slate-700">Legend</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-red-500 bg-red-50" />
          Deal-breaker
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-dashed border-amber-500 bg-amber-50" />
          Needs review
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-slate-400 bg-slate-50" />
          Award criterion
        </span>
        <span className="inline-flex items-center gap-1.5">
          <svg width="22" height="8" aria-hidden>
            <line
              x1="0"
              y1="4"
              x2="22"
              y2="4"
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
          </svg>
          Depends on
        </span>
      </div>

      <div className="h-[70vh] w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          proOptions={{ hideAttribution: true }}
          nodesDraggable
          nodesConnectable={false}
        >
          <Background color="#e2e8f0" gap={20} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
}
