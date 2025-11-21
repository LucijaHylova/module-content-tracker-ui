import type { EChartsOption, PieSeriesOption } from 'echarts';


export function createPieChartConfig(
  title: string,
  seriesName: string,
  data: { name: string; value: number }[]
): EChartsOption {
  return {
    title: {
      text: title,
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '5%',
      left: 'center'
    },
    series: [
      {
        name: seriesName,
        type: 'pie',
        radius: '50%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      } as PieSeriesOption
    ]
  };
}
