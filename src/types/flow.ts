
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
  initial_prompt?: string;
  instructions?: string;
  documents?: string[];
  chat_flow?: {
    states: State[];
    actions: Action[];
  };
  nodes?: FlowNode[];
  edges?: FlowEdge[];
}

export type State = {
  id: string;
  name: string;
  description: string;
}

export type Action = {
  id: string;
  name: string;
  description: string;
  type: "core" | "custom";
  source: string;
  target: string;
}
