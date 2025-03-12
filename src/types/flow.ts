
import { Node, Edge } from '@xyflow/react';

export interface StateNodeData extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  onNodeClick: (id: string) => void;
}

export interface ActionEdgeData extends Record<string, unknown> {
  name: string;
  description: string;
  type: 'core' | 'custom';
  onEdgeClick: (id: string) => void;
}

export type FlowNode = Node<StateNodeData>;
export type FlowEdge = Edge<ActionEdgeData>;

