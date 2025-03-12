
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { StateNodeData } from '../types/flow';

function StateNode({ data }: { data: StateNodeData }) {
  const handleClick = () => {
    data.onNodeClick(data.id);
  };

  return (
    <div onClick={handleClick} className="px-4 py-2 shadow-md rounded-md bg-white">
      <Handle type="target" position={Position.Top} className="custom-handle" />
      <div className="font-bold">{data.name}</div>
      <div className="text-sm">{data.description}</div>
      <Handle type="source" position={Position.Bottom} className="custom-handle" />
    </div>
  );
}

export default memo(StateNode);
