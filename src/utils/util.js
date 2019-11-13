/**
 * 销售流水
 * @param {*} val
 */
export function flowStatus(val) {
  if (val == 40) {
    return '正常'
  } else {
    return '异常'
  }
}
/**
 * audit处理
 */
export function handleAudit(val) {
  let x
  switch (val) {
    case '11':
    case '12':
    case '13':
      x = '审核中'
      break;
    case '14':
      x = '申诉中'
      break;
    case '51':
    case '52':
    case '31':
    case '41':
    case '500':
      x = '待确认'
      break;
    case '200':
      x = '已确认'
      break;
    // case '500':
    //   x = '申诉失败'
    //   break;
    default:
      x = '数据异常'
      break;
  }
  return x
}
/**
 * 对账单状态
 */
export function handleStatusStatement(val) {
  let x
  if (val == 1) {
    x = '正常'
  } else if (val == 2) {
    x = '异常'
  } else {
    x = '数据异常'
  }
  return x
}
/**
 * 申诉状态
 */
export function handleStatusAppeal(val) {
  let x
  if (val == '申诉中') {
    x = '申诉中'
  } else if (val == '申诉成功') {
    x = '已同意'
  } else if (val == '申诉失败') {
    x = '已驳回'
  } else {
    x = '数据异常'
  }
  return x
}
/**
 * 结算状态
 */
export function handleStatusAccount(val) {
  let x
  switch (true) {
    case val == '31':
      x = '待结算'
      break;
    default:
      x = '数据异常'
      break;
  }
  return x
}
/**
 * 结算记录
 */
export function handleStatusRecord(val) {
  let x
  switch (true) {
    case val == '21':
    case val == '22':
    case val == '23':
    case val == '24':
      x = '审核中'
      break;
    case val == '41':
      x = '待付款'
      break;
    case val == '52':
      x = '待确认'
      break;
    case val == '200':
      x = '已确认'
      break;
    case val == '500':
      x = '审核失败'
      break;
    default:
      x = '数据异常'
      break;
  }
  return x
}
/**
 * 加油机销售汇总echarts-option生成
 */
export function sellTankerOption(val, type) {
  let xData = [], yData = [], x = [], value1 = [], value2 = [], value3 = []
  if (val.refuelingGunSalesStatistics instanceof Array) {
    val.refuelingGunSalesStatistics.forEach(item => {
      x.push({
        name: item.gunName,
        value: item.gunAmount || 0
      })
    })
  }
  value1 = JSON.parse(JSON.stringify(x))
  value1.push({
    name: '总计',
    value: val.totalSalesAmount || 0
  })
  value2 = statisticsGasPie(x)
  if (val.salesRecordsTrend instanceof Array) {
    val.salesRecordsTrend.forEach(item => {
      if (type == 2) {
        xData.push(item.settlemntTimes.substr(11))
      } else {
        xData.push(item.settlemntTimes)
      }
      yData.push(item.amounts)
    })
  }
  xData.reverse()
  yData.reverse()
  value3 = statisticsGasLine(xData, yData, type, ' ', [], [])
  return [value1, value2, value3]
}
/**
 * 加油站销售汇总echarts-option生成
 */
export function statisticsGas(val, type) {
  let value1, value2, value3, value4, value5, value6
  let x = [], y = [], xData = [], yData1 = [], yData2 = [], yData3 = [], lenged = ['92#', '95#']
  if (val.stationYpReportDtos instanceof Array) {
    val.stationYpReportDtos.forEach(item => {
      x.push({
        name: item.ypName + '#',
        value: item.ypAmount
      })
    })
  }
  value1 = statisticsGasPie(x)
  value2 = JSON.parse(JSON.stringify(x))
  value2.push({ name: "总计", value: val.stationAmount || 0 })
  if (val.machineReportDtos instanceof Array) {
    val.machineReportDtos.forEach(item => {
      y.push({
        name: item.machineName,
        value: item.machineAmount
      })
    })
  }
  value3 = statisticsGasPie(y)
  value4 = JSON.parse(JSON.stringify(y))
  value4.push({ name: "总计", value: val.stationAmount || 0 })
  if (val.ypQsList instanceof Array) {
    val.ypQsList.forEach(item => {
      if (type == 2) {
        xData.push(item[0].qsStr.substr(11))
      } else {
        xData.push(item[0].qsStr)
      }
      yData1.push(item[0].ypName == '92' ? item[0].sumMachineAmount : item[1].sumMachineAmount)
      yData2.push(item[0].ypName == '95' ? item[0].sumMachineAmount : item[1].sumMachineAmount)
    })
  }
  xData.reverse()
  yData1.reverse()
  yData2.reverse()
  value5 = statisticsGasLine(xData, yData1, type, ' ', yData2, lenged)
  val.machineQsList.forEach(item => {
    yData3.push(item.sumMachineAmount)
  })
  yData3.reverse()
  value6 = statisticsGasLine(xData, yData3, type, ' ', [], [])
  return [value1, value2, value3, value4, value5, value6]
}

export const colorListPie = ['#46D695', '#7082FE', '#FD8081', '#F3B353'];
function statisticsGasPie(val) {
  let colorList = colorListPie
  return {
    tooltip: {
      trigger: 'item',
      formatter: "{b}: <br/> {c}元 ({d}%)",
      position: 'right'
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        data: val,
        itemStyle: {
          normal: {
            color: function (params) {
              return colorList[params.dataIndex]
            }
          },
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          normal: {
            show: true,
            formatter: function (param) {
              // console.log(param);
              return param.name + '\n\n' + param.value + '(' + param.percent + '%)'
            }
          }
        },
        labelLine: {
          normal: {
            show: true
          }
        }
      }
    ]
  }
}
function statisticsGasLine(x, y, type, name, val, param) {
  let data = {
    title: {
      text: name
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: "category",
      data: x,
      axisTick: {
        show: false
      }
    },
    grid: {
      x: '80px',
      x2: '80px'
    },
    yAxis: {
      name: '销售额（万元）',
      type: "value",
      axisTick: {
        show: false
      }
    },
    series: [
      {
        name: param[0] || '',
        data: y,
        type: "line",
        lineStyle: {
          color: '#F250B2'
        },
        itemStyle: {
          normal: {
            color: '#F250B2'
          }
        },
        areaStyle:{
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ //折线图颜色渐变
                    offset: 0,
                    color: 'rgba(242, 80, 178, .4)'
                }, {
                    offset: 1,
                    color: 'rgba(242, 80, 178, 0)'
                }])
          }
        }
      }
    ]
  }
  if (type == 1) {
    data.dataZoom = [
      {
        show: true,
        type: 'slider',
        realtime: true,
        start: 0,
        end: 50,
        zoomOnMouseWheel: false
      },
      {
        type: 'inside',
        realtime: true,
        zoomOnMouseWheel: false
      }
    ]
  }
  if (val) {
    data.series.push({
      name: param[1],
      data: val,
      type: "line",
      lineStyle: {
        color: '#6D9CFF'
      },
      itemStyle: {
        normal: {
          color: '#6D9CFF'
        }
      },
      areaStyle:{
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ //折线图颜色渐变
                  offset: 0,
                  color: 'rgba(109, 156, 255, .4)'
              }, {
                  offset: 1,
                  color: 'rgba(109, 156, 255, 0)'
              }])
        }
      }
    })
    data.legend = {
      data: param
    }
  }
  return data
}
