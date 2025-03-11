
import { memo, useCallback } from 'react';
import { 
  EdgeProps, 
  getSmoothStepPath, 
  EdgeLabelRenderer,
  useReactFlow
} from '@xyflow/react';
import { X } from 'lucide-react';

export interface ActionEdgeData {
  name: string;
  description: string;
  type: 'core' | 'custom';
  onEdgeClick: (id: string) => void;
}

const ActionEdge = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  style = {},
  markerEnd,
}: EdgeProps & { data?: ActionEdgeData }) => {
  const reactFlowInstance = useReactFlow();
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = useCallback(() => {
    if (data?.onEdgeClick) {
      data.onEdgeClick(id);
    }
  }, [id, data]);

  const onEdgeDelete = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      reactFlowInstance.deleteElements({ edges: [{ id }] });
    },
    [id, reactFlowInstance]
  );

  const edgeColor = data?.type === 'core' ? '#D6BCFA' : '#7E69AB';
  const edgeStyle = {
    ...style,
    stroke: selected ? '#9b87f5' : edgeColor,
    strokeWidth: selected ? 3 : 2,
  };

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={edgeStyle}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div
            className={`px-2 py-1 rounded-md text-xs ${
              selected ? 'bg-primary text-white' : 'bg-white'
            } shadow-sm border border-gray-200 cursor-pointer`}
            onClick={onEdgeClick}
          >
            {data?.name || 'Acción sin nombre'}
          </div>
          {selected && (
            <button
              className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full shadow-sm border border-gray-200 flex items-center justify-center"
              onClick={onEdgeDelete}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default memo(ActionEdge);
