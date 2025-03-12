
export interface StateNodeData extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  onNodeClick: (id: string) => void;
}

export interface ActionEdgeData extends Record<string, unknown> {
  name: string;
  description: string;
  type: "core" | "custom";
  onEdgeClick: (id: string) => void;
}

export type FlowNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: StateNodeData;
}

export type FlowEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
  type?: string;
  data: ActionEdgeData;
}

export type Bot = {
  id: string;
  name: string;
  description: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}
