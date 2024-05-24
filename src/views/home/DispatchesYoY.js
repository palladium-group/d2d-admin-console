import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';

const DispatchesYoY = ({ height, data }) => {
  const [options, setOptions] = useState({});
  console.log(data.facilitiesProcessedByYear);

  useEffect(() => {
    setOptions({
      chart: {
        height: height
      },
      title: {
        text: 'Number of Dispatches Processed YoY',
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
        }
      },

      series: data.facilitiesProcessedByYear,
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }
        ]
      }
    });
  }, []);
  return <HighchartsReact highcharts={Highcharts} options={options} />;
};
export default DispatchesYoY;
