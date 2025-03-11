
import { useState, useEffect, memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export interface StateNodeData {
  id: string;
  name: string;
  description: string;
  onNodeClick: (id: string) => void;
}

const StateNode = ({ data, selected }: { data: StateNodeData; selected: boolean }) => {
  const [nodeName, setNodeName] = useState(data.name);

  useEffect(() => {
    setNodeName(data.name);
  }, [data.name]);

  const handleClick = () => {
    data.onNodeClick(data.id);
  };

  return (
    <div
      className={`p-4 rounded-md bg-white border-2 ${
        selected ? 'border-primary' : 'border-bot-state'
      } shadow-md cursor-pointer transition-all duration-200 ease-in-out`}
      onClick={handleClick}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-bot-state"
      />
      <div className="text-sm font-medium mb-1 text-center">{nodeName || "Sin nombre"}</div>
      <div className="text-xs text-muted-foreground truncate w-full text-center">
        {data.description ? data.description.substring(0, 50) + (data.description.length > 50 ? "..." : "") : "Sin descripción"}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-bot-action"
      />
    </div>
  );
};

export default memo(StateNode);
