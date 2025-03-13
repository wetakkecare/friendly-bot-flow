
import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Panel,
  ReactFlowProvider,
  MarkerType,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import StateNode from './StateNode';
import ActionEdge from './ActionEdge';
import PropertiesPanel from './PropertiesPanel';
import { Button } from './ui/button';
import { Plus, Search, Trash } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { FlowNode, FlowEdge, StateNodeData, ActionEdgeData, Bot, State, Action } from '../types/flow';
import { Input } from './ui/input';

interface FlowEditorProps {
  bot: Bot;
  onBotChange: (bot: Bot) => void;
  readOnly?: boolean;
}

const nodeTypes = {
  state: StateNode,
};

const edgeTypes = {
  action: ActionEdge,
};

const FlowEditorContent = ({ bot, onBotChange, readOnly = false }: FlowEditorProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [filterQuery, setFilterQuery] = useState("");
  const reactFlow = useReactFlow();
  
  // Initialize nodes from bot states or empty array
  const initialNodes: FlowNode[] = (bot.chat_flow?.states || []).map(state => ({
    id: state.id,
    type: 'state',
    position: { 
      x: Math.random() * 500, 
      y: Math.random() * 400 
    },
    data: {
      id: state.id,
      name: state.name,
      description: state.description,
      onNodeClick: handleElementSelect
    },
  }));
  
  // Initialize edges from bot actions or empty array
  const initialEdges: FlowEdge[] = (bot.chat_flow?.actions || []).map(action => ({
    id: action.id,
    source: action.source,
    target: action.target,
    sourceHandle: null,
    targetHandle: null,
    type: 'action',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#9b87f5',
    },
    data: {
      name: action.name,
      description: action.description,
      type: action.type,
      onEdgeClick: handleElementSelect
    },
  }));
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedElement, setSelectedElement] = useState<FlowNode | FlowEdge | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  function handleElementSelect(id: string) {
    if (readOnly) return;
    
    const node = nodes.find(n => n.id === id);
    const edge = edges.find(e => e.id === id);
    
    setSelectedElement(node || edge || null);
  }
  
  const onConnect = useCallback(
    (params: Connection) => {
      if (readOnly) return;
      
      const newEdgeId = `edge-${Date.now()}`;
      const newEdge = {
        ...params,
        id: newEdgeId,
        type: 'action',
        sourceHandle: params.sourceHandle || null,
        targetHandle: params.targetHandle || null,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#9b87f5',
        },
        data: {
          name: 'New action',
          description: 'Action description',
          type: 'core' as const,
          onEdgeClick: handleElementSelect
        }
      };
      
      setEdges((eds) => addEdge(newEdge, eds));
      
      const newAction: Action = {
        id: newEdgeId,
        name: 'New action',
        description: 'Action description',
        type: 'core',
        source: params.source as string,
        target: params.target as string
      };
      
      const updatedBot = {
        ...bot,
        chat_flow: {
          states: [...(bot.chat_flow?.states || [])],
          actions: [...(bot.chat_flow?.actions || []), newAction]
        }
      };
      
      onBotChange(updatedBot);
    },
    [bot, onBotChange, setEdges, readOnly]
  );
  
  const onStateUpdate = useCallback(
    (id: string, data: Partial<StateNodeData>) => {
      if (readOnly) return;
      
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? {
                ...node,
                data: { ...node.data, ...data },
              }
            : node
        )
      );
      
      const updatedBot = {
        ...bot,
        chat_flow: {
          ...bot.chat_flow,
          states: (bot.chat_flow?.states || []).map(state =>
            state.id === id
              ? { ...state, ...data }
              : state
          ),
          actions: [...(bot.chat_flow?.actions || [])]
        }
      };
      
      onBotChange(updatedBot);
    },
    [bot, onBotChange, setNodes, readOnly]
  );
  
  const onActionUpdate = useCallback(
    (id: string, data: Partial<ActionEdgeData>) => {
      if (readOnly) return;
      
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === id
            ? {
                ...edge,
                data: { ...edge.data, ...data },
              }
            : edge
        )
      );
      
      const updatedBot = {
        ...bot,
        chat_flow: {
          ...bot.chat_flow,
          states: [...(bot.chat_flow?.states || [])],
          actions: (bot.chat_flow?.actions || []).map(action =>
            action.id === id
              ? { ...action, ...data }
              : action
          )
        }
      };
      
      onBotChange(updatedBot);
    },
    [bot, onBotChange, setEdges, readOnly]
  );
  
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  const handleAddNode = useCallback(() => {
    if (readOnly || !reactFlowInstance) return;
    
    const newNodeId = `state-${Date.now()}`;
    const position = reactFlowInstance.screenToFlowPosition({
      x: Math.random() * 500,
      y: Math.random() * 300,
    });
    
    const newState: State = {
      id: newNodeId,
      name: 'New State',
      description: 'State description',
    };
    
    const newNode: FlowNode = {
      id: newNodeId,
      position,
      data: {
        id: newNodeId,
        name: 'New State',
        description: 'State description',
        onNodeClick: handleElementSelect,
      },
      type: 'state',
    };
    
    // Update local state first
    setNodes((nds) => [...nds, newNode]);
    
    // Then update the bot object to persist changes
    const updatedBot = {
      ...bot,
      chat_flow: {
        states: [...(bot.chat_flow?.states || []), newState],
        actions: [...(bot.chat_flow?.actions || [])]
      }
    };
    
    onBotChange(updatedBot);
    
    toast({
      title: "State created",
      description: "A new state has been added to the flow",
    });
  }, [reactFlowInstance, setNodes, bot, onBotChange, toast, readOnly]);
  
  const handleDeleteSelected = useCallback(() => {
    if (readOnly || !selectedElement) return;
    
    if ('position' in selectedElement) {
      const nodeId = selectedElement.id;
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      
      const updatedBot = {
        ...bot,
        chat_flow: {
          states: (bot.chat_flow?.states || []).filter(state => state.id !== nodeId),
          actions: (bot.chat_flow?.actions || []).filter(action => 
            action.source !== nodeId && action.target !== nodeId
          )
        }
      };
      
      onBotChange(updatedBot);
    } else if ('source' in selectedElement) {
      const edgeId = selectedElement.id;
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
      
      const updatedBot = {
        ...bot,
        chat_flow: {
          ...bot.chat_flow,
          states: [...(bot.chat_flow?.states || [])],
          actions: (bot.chat_flow?.actions || []).filter(action => action.id !== edgeId)
        }
      };
      
      onBotChange(updatedBot);
    }
    
    setSelectedElement(null);
    
    toast({
      title: "Element deleted",
      description: "The selected element has been removed",
    });
  }, [selectedElement, setNodes, setEdges, bot, onBotChange, toast, readOnly]);
  
  useEffect(() => {
    if (!filterQuery) {
      // When filter is cleared, reset to initial nodes
      const updatedNodes = (bot.chat_flow?.states || []).map(state => ({
        id: state.id,
        type: 'state',
        position: { 
          x: Math.random() * 500, 
          y: Math.random() * 400 
        },
        data: {
          id: state.id,
          name: state.name,
          description: state.description,
          onNodeClick: handleElementSelect
        },
      }));
      setNodes(updatedNodes);
      return;
    }
    
    const query = filterQuery.toLowerCase();
    const filteredNodes = nodes.map(node => ({
      ...node,
      hidden: !(
        String(node.data.name).toLowerCase().includes(query) || 
        String(node.data.description).toLowerCase().includes(query)
      )
    }));
    
    setNodes(filteredNodes);
  }, [filterQuery, setNodes, nodes, bot]);
  
  useEffect(() => {
    const nodeIds = nodes.filter(node => !node.hidden).map(node => node.id);
    const visibleEdges = edges.map(edge => ({
      ...edge,
      hidden: !nodeIds.includes(edge.source) || !nodeIds.includes(edge.target)
    }));
    
    setEdges(visibleEdges);
  }, [nodes, setEdges, edges]);
  
  // This effect ensures our local state stays in sync with the bot data
  useEffect(() => {
    if (bot.chat_flow) {
      const updatedNodes = bot.chat_flow.states.map(state => {
        // Try to find existing node position
        const existingNode = nodes.find(n => n.id === state.id);
        
        return {
          id: state.id,
          type: 'state',
          position: existingNode ? existingNode.position : { 
            x: Math.random() * 500, 
            y: Math.random() * 400 
          },
          data: {
            id: state.id,
            name: state.name,
            description: state.description,
            onNodeClick: handleElementSelect
          },
        };
      });
      
      setNodes(updatedNodes);
      
      const updatedEdges = bot.chat_flow.actions.map(action => ({
        id: action.id,
        source: action.source,
        target: action.target,
        sourceHandle: null,
        targetHandle: null,
        type: 'action',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#9b87f5',
        },
        data: {
          name: action.name,
          description: action.description,
          type: action.type,
          onEdgeClick: handleElementSelect
        },
      }));
      
      setEdges(updatedEdges);
    }
  }, [bot.chat_flow, setNodes, setEdges]);
  
  return (
    <div className="w-full h-[600px] flex border border-gray-200 rounded-md overflow-hidden">
      <div ref={reactFlowWrapper} className="flex-grow h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={readOnly ? undefined : onNodesChange}
          onEdgesChange={readOnly ? undefined : onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={(_, node) => handleElementSelect(node.id)}
          onEdgeClick={(_, edge) => handleElementSelect(edge.id)}
          onPaneClick={() => !readOnly && setSelectedElement(null)}
          fitView
          nodesConnectable={!readOnly}
          nodesDraggable={!readOnly}
          elementsSelectable={!readOnly}
          edgesFocusable={!readOnly}
          nodesFocusable={!readOnly}
        >
          <Background />
          <Controls />
          <MiniMap 
            nodeStrokeWidth={3}
            nodeColor={() => '#9b87f5'}
            maskColor="rgba(240, 240, 240, 0.3)"
          />
          {!readOnly && (
            <Panel position="top-right" className="space-x-2 flex">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search states..."
                  className="pl-8 w-[200px]"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleAddNode} size="sm" className="flex items-center">
                <Plus className="mr-1 h-4 w-4" />
                Add State
              </Button>
              <Button 
                onClick={handleDeleteSelected} 
                size="sm" 
                variant="destructive" 
                disabled={!selectedElement}
                className="flex items-center"
              >
                <Trash className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </Panel>
          )}
        </ReactFlow>
      </div>
      {selectedElement && !readOnly && (
        <PropertiesPanel
          selectedElement={selectedElement}
          onStateUpdate={onStateUpdate}
          onActionUpdate={onActionUpdate}
          onClose={() => setSelectedElement(null)}
        />
      )}
    </div>
  );
};

const FlowEditor = (props: FlowEditorProps) => (
  <ReactFlowProvider>
    <FlowEditorContent {...props} />
  </ReactFlowProvider>
);

export default FlowEditor;
