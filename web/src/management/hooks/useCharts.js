import { init, use } from 'echarts/core'
import { BarChart, PieChart, GaugeChart } from 'echarts/charts'
import {
  TooltipComponent,
  TitleComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { getOption } from '@/management/config/chartConfig'

// Daftarkan hanya modul yang diperlukan
use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  PieChart,
  GaugeChart,
  CanvasRenderer
])

/**
 * Menggambar grafik
 * @param {Object} el - elemen DOM
 * @param {String} type - tipe grafik
 * @param {Array} data - data untuk grafik
 */
export default (el, type, data) => {
  const chart = init(el)
  const option = getOption[type](data)

  chart.setOption(option, true)

  const resize = () => {
    chart.resize()
  }

  const changeType = (newType, newData) => {
    chart.setOption(getOption[newType](newData), true)
  }

  return { chart, resize, changeType }
}