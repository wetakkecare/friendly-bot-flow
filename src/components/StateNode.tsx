
import { Handle, Position } from '@xyflow/react';
import { StateNodeData } from '@/types/flow';

const StateNode = ({ data, id }: { data: StateNodeData; id: string }) => {
  const handleNodeClick = () => {
    data.onNodeClick(id);
  };

  return (
    <div 
      className="border-2 border-purple-400 bg-white rounded-md p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow w-[180px]"
      onClick={handleNodeClick}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-purple-500"
      />
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-1 text-gray-800">{data.name}</h3>
        <p className="text-xs text-gray-500 truncate max-w-[160px]">{data.description}</p>
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-purple-500"
      />
    </div>
  );
};

export default StateNode;
