import { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Panel,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import StateNode from './StateNode';
import ActionEdge from './ActionEdge';
import PropertiesPanel from './PropertiesPanel';
import { Button } from './ui/button';
import { Plus, Trash } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { FlowNode, FlowEdge, StateNodeData, ActionEdgeData } from '../types/flow';

interface FlowEditorProps {
  bot: {
    id: string;
    chat_flow: {
      states: Array<{
        id: string;
        name: string;
        description: string;
      }>;
      actions: Array<{
        id: string;
        name: string;
        description: string;
        type: 'core' | 'custom';
        source: string;
        target: string;
      }>;
    };
  };
  onBotChange: (bot: any) => void;
  filterQuery?: string;
}

const nodeTypes = {
  state: StateNode,
};

const edgeTypes = {
  action: ActionEdge,
};

const FlowEditor = ({ bot, onBotChange, filterQuery }: FlowEditorProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const initialNodes: FlowNode[] = bot.chat_flow.states.map(state => ({
    id: state.id,
    type: 'state',
    position: { x: Math.random() * 500, y: Math.random() * 400 },
    data: {
      id: state.id,
      name: state.name,
      description: state.description,
      onNodeClick: handleElementSelect
    },
  }));
  
  const initialEdges: FlowEdge[] = bot.chat_flow.actions.map(action => ({
    id: action.id,
    source: action.source,
    target: action.target,
    type: 'action',
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
  
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `e-${Date.now()}`,
        type: 'action',
        data: {
          name: 'Nueva acción',
          description: 'Descripción de la acción',
          type: 'core' as const,
          onEdgeClick: handleElementSelect
        }
      };
      
      setEdges((eds) => addEdge(newEdge, eds));
      
      const newAction: Action = {
        id: newEdge.id,
        name: 'Nueva acción',
        description: 'Descripción de la acción',
        type: 'core',
        source: params.source as string,
        target: params.target as string
      };
      
      const updatedBot = {
        ...bot,
        chat_flow: {
          ...bot.chat_flow,
          actions: [...bot.chat_flow.actions, newAction]
        }
      };
      
      onBotChange(updatedBot);
    },
    [bot, onBotChange, setEdges]
  );
  
  function handleElementSelect(id: string) {
    const node = nodes.find(n => n.id === id);
    const edge = edges.find(e => e.id === id);
    
    setSelectedElement(node || edge || null);
  }
  
  const onStateUpdate = useCallback(
    (id: string, data: Partial<StateNodeData>) => {
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
          states: bot.chat_flow.states.map(state =>
            state.id === id
              ? { ...state, ...data }
              : state
          )
        }
      };
      
      onBotChange(updatedBot);
    },
    [bot, onBotChange, setNodes]
  );
  
  const onActionUpdate = useCallback(
    (id: string, data: Partial<ActionEdgeData>) => {
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
          actions: bot.chat_flow.actions.map(action =>
            action.id === id
              ? { ...action, ...data }
              : action
          )
        }
      };
      
      onBotChange(updatedBot);
    },
    [bot, onBotChange, setEdges]
  );
  
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  const handleAddNode = useCallback(() => {
    if (!reactFlowInstance) return;
    
    const newNodeId = `state-${Date.now()}`;
    const position = reactFlowInstance.screenToFlowPosition({
      x: Math.random() * 500,
      y: Math.random() * 300,
    });
    
    const newNode: FlowNode = {
      id: newNodeId,
      position,
      data: {
        id: newNodeId,
        name: 'Nuevo estado',
        description: 'Descripción del estado',
        onNodeClick: handleElementSelect,
      },
      type: 'state',
    };
    
    setNodes((nds) => [...nds, newNode]);
    
    const newState: State = {
      id: newNodeId,
      name: 'Nuevo estado',
      description: 'Descripción del estado',
    };
    
    const updatedBot = {
      ...bot,
      chat_flow: {
        ...bot.chat_flow,
        states: [...bot.chat_flow.states, newState]
      }
    };
    
    onBotChange(updatedBot);
    
    toast({
      title: "Estado creado",
      description: "Se ha creado un nuevo estado en el flujo",
    });
  }, [reactFlowInstance, setNodes, bot, onBotChange, toast]);
  
  const handleDeleteSelected = useCallback(() => {
    if (!selectedElement) return;
    
    if ('position' in selectedElement) {
      const nodeId = selectedElement.id;
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      
      const updatedBot = {
        ...bot,
        chat_flow: {
          states: bot.chat_flow.states.filter(state => state.id !== nodeId),
          actions: bot.chat_flow.actions.filter(action => 
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
          actions: bot.chat_flow.actions.filter(action => action.id !== edgeId)
        }
      };
      
      onBotChange(updatedBot);
    }
    
    setSelectedElement(null);
    
    toast({
      title: "Elemento eliminado",
      description: "Se ha eliminado el elemento seleccionado",
    });
  }, [selectedElement, setNodes, setEdges, bot, onBotChange, toast]);
  
  useEffect(() => {
    if (!filterQuery) {
      setNodes(initialNodes);
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
  }, [filterQuery, bot.chat_flow.states, setNodes]);
  
  useEffect(() => {
    const nodeIds = nodes.map(node => node.id);
    const visibleEdges = edges.map(edge => ({
      ...edge,
      hidden: !nodeIds.includes(edge.source) || !nodeIds.includes(edge.target)
    }));
    
    setEdges(visibleEdges);
  }, [nodes, setEdges]);
  
  return (
    <div className="w-full h-full flex">
      <div ref={reactFlowWrapper} className="flex-grow h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={(_, node) => handleElementSelect(node.id)}
          onEdgeClick={(_, edge) => handleElementSelect(edge.id)}
          onPaneClick={() => setSelectedElement(null)}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap 
            nodeStrokeWidth={3}
            nodeColor={(node) => {
              return '#9b87f5';
            }}
            maskColor="rgba(240, 240, 240, 0.3)"
          />
          <Panel position="top-right" className="space-x-2">
            <Button onClick={handleAddNode} size="sm" className="flex items-center">
              <Plus className="mr-1 h-4 w-4" />
              Añadir Estado
            </Button>
            <Button 
              onClick={handleDeleteSelected} 
              size="sm" 
              variant="destructive" 
              disabled={!selectedElement}
              className="flex items-center"
            >
              <Trash className="mr-1 h-4 w-4" />
              Eliminar
            </Button>
          </Panel>
        </ReactFlow>
      </div>
      {selectedElement && (
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

const FlowEditorWithProvider = (props: FlowEditorProps) => (
  <ReactFlowProvider>
    <FlowEditor {...props} />
  </ReactFlowProvider>
);

export default FlowEditorWithProvider;
