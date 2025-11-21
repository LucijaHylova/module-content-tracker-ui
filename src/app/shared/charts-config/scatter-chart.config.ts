import type { EChartsOption, ScatterSeriesOption } from 'echarts';
import { ItemStyle, ScatterNode } from '../models/scatter.model';
import { environment } from '../../../environments/environment';

export function createScatterChartConfig(nodes: ScatterNode[], tooltipFormatter: (params: any) => string): EChartsOption {
  const categories = [...new Set(nodes.map(n => n.category))];
  const TEST_MODE = environment.testMode;
  const series: ScatterSeriesOption[] = categories.map(category => ({

    name: category,
    type: 'scatter',
    animation: true,
    animationDurationUpdate: TEST_MODE ? 0 : 6000,
    label: TEST_MODE ? {
      show: true,
      position: 'right',
      fontSize: 10,
      fontWeight: 'lighter',
      formatter: (param: any) => param?.data?.name
    } : { show: false },
    data: nodes
      .filter(n => n.category === category)
      .map(n => {

        let itemStyle: ItemStyle = {
          color: n.itemStyle?.color,
          borderColor: n.itemStyle?.borderColor,
          borderWidth: n.itemStyle?.borderWidth,
          opacity: n.itemStyle?.opacity
        };


        return {
          name: n.name,
          id: n.id,
          value: [n.x, n.y],
          ects: n.ects,
          selectedSemester: n.selectedSemester,
          specialization: n.specialization,
          category: n.category,
          symbolSize: 25,
          itemStyle: itemStyle,
          status: n.status
        };
      })
  }));

  return {
    tooltip: {
      formatter: tooltipFormatter
    },

    legend: {
      data: categories,
      bottom: 0
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      name: 'Semester',
      type: 'value',

      min: 0,
      interval: 1
    },
    xAxis: {
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      name: 'ETCS',
      type: 'value',
      min: 0,
      interval: 30

    },
    series
  };
}
