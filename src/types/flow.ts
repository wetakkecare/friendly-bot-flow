
import { MarkerType } from '@xyflow/react';

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
  hidden?: boolean;
}

export type FlowEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
  type?: string;
  data: ActionEdgeData;
  hidden?: boolean;
  markerEnd?: {
    type: MarkerType;
    width: number;
    height: number;
    color: string;
  };
}

export type Bot = {
  id: string;
  name: string;
  description: string;
  initial_prompt?: string;
  instructions?: string;
  documents?: string[] | null;
  chat_flow?: {
    states: State[];
    actions: Action[];
  } | null;
  user_id?: string;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
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
