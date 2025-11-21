import type { EChartsOption } from 'echarts';
import { GraphEdge, GraphNode } from '../models/graph.model';
import { environment } from '../../../environments/environment';
import { ModuleComparisonGraphEdge, ModuleComparisonGraphNode } from '../models/module-comparison-graph.model';




export function createGraphChartConfig(
  categories: { name: string | undefined }[],
  nodes: GraphNode[] | ModuleComparisonGraphNode[],
  edges: GraphEdge[] | ModuleComparisonGraphEdge[],
  legendSelection?: Record<string, boolean>,
  draggable?: boolean
): EChartsOption {
  const TEST_MODE = environment.testMode;

  const layout = TEST_MODE ? 'none' : 'force';
  const nodeData = TEST_MODE
    ? nodes.map((node, i) => ({
      ...node,
      x: (i % 20) * 600,
      y: Math.floor(i / 30) * 200
    }))
    : nodes;
  return {
    tooltip: {},

    legend: [{
      data: categories.map(c => c.name).filter(Boolean) as string[],
      bottom: 0,
      selected: legendSelection
    }],

    series: [{
      type: 'graph',
      layout: layout,
      animation: false,
      animationDuration: 10,
      animationDurationUpdate: 10,
      roam: true,
      draggable: draggable,
      label: { show: true, position: 'right' },
      force: { repulsion: 1000 },
      data: nodeData,
      links: edges,
      categories: categories,
      lineStyle: {
        color: 'source',
        width: 0.5,
        curveness: 0.3,
        opacity: 0.7
      },
      emphasis: {
        focus: 'adjacency',
        label: {
          position: 'right',
          show: true
        }
      },
    }],
    thumbnail: {
      width: '30%',
      height: '20%',
      windowStyle: {
        color: 'rgba(140, 212, 250, 0.5)',
        borderColor: 'rgba(30, 64, 175, 0.7)',
        opacity: 1
      }
    }
  };
}
