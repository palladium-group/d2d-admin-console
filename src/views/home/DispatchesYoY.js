import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const DispatchesYoY = ({ height, data }) => {
  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const theme = useTheme();

  useEffect(() => {
    if (
      data &&
      data.facilitiesProcessedByYear &&
      data.facilitiesProcessedByYear.length > 0
    ) {
      const seriesData = [];
      for (const yearProcessed of data.facilitiesProcessedByYear) {
        const yearData = { name: yearProcessed.name, data: [] };
        for (let i = 1; i <= 12; i++) {
          if (yearProcessed.name == currentYear && i === currentMonth + 2) {
            break;
          }
          const val = yearProcessed.data.find((obj) => obj.month === i);
          if (val) {
            yearData.data.push(val.sum);
          } else {
            yearData.data.push(0);
          }
        }
        seriesData.push(yearData);
      }
      setSeries(seriesData);
    }
  }, [data]);

  useEffect(() => {
    setOptions({
      chart: {
        height: '46%', //height - 80,
        type: 'spline'
      },
      title: {
        text: '',
        align: 'left'
      },
      yAxis: {
        title: {
          text: 'Number of Dispatches'
        }
      },
      xAxis: [
        {
          accessibility: {
            rangeDescription: 'Months'
          },
          categories: [
            'JAN',
            'FEB',
            'MAR',
            'APR',
            'MAY',
            'JUN',
            'JUL',
            'AUG',
            'SEP',
            'OCT',
            'NOV',
            'DEC'
          ]
        }
      ],

      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          }
        },
        spline: {
          dataLabels: {
            //enabled: true
          },
          enableMouseTracking: false
        }
      },
      series: [
        {
          data: series[1] ? series[1].data : [],
          name: series[1] ? series[1].name : null,
          color: theme.palette.primary.main,
          dataLabels: {
            enabled: true,
            x: -15,
            color: theme.palette.primary.main,
            style: {
              textOutline: 'none'
            }
          }
        },
        {
          data: series[0] ? series[0].data : [],
          name: series[0] ? series[0].name : null,
          color: theme.palette.secondary.main,
          dataLabels: {
            enabled: true,
            x: 15,
            color: theme.palette.secondary.main,
            style: {
              textOutline: 'none'
            }
          }
        }
      ],
      responsive: {
        rules: [
          {
            condition: {
              maxHeight: height
            },
            chartOptions: {
              legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
              }
            }
          }
        ]
      }
    });
  }, [series, height]);
  return series.length === 0 ? (
    <Box display="flex" justifyContent="center" my={6}>
      <CircularProgress />
    </Box>
  ) : (
    <HighchartsReact highcharts={Highcharts} options={options} />
  );
};
export default DispatchesYoY;
