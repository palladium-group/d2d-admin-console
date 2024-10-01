import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import useConfig from 'hooks/useConfig';
import { useTheme } from '@mui/material/styles';

const RecordGrowthChart = ({ height, data }) => {
  const config = useConfig();
  const theme = useTheme();

  const [options, setOptions] = useState({});
  const [patientCountSeriesData, setPatientCountSeriesData] = useState([]);
  const [visitCountSeriesData, setVisitCountSeriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /*const calculateTrendline = (data) => {
    const n = data.length;
    const sumX = data.reduce((sum, point) => sum + point[0], 0);
    const sumY = data.reduce((sum, point) => sum + point[1], 0);
    const sumXY = data.reduce((sum, point) => sum + point[0] * point[1], 0);
    const sumX2 = data.reduce((sum, point) => sum + point[0] * point[0], 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const trendlineData = data.map((point) => [
      point[0],
      slope * point[0] + intercept
    ]);
    return trendlineData;
  };*/

  useEffect(() => {
    setIsLoading(true);
    if (data.history && data.history.length > 0) {
      const patientCounts = data.history.map((item) => [
        new Date(item.date).getTime(),
        item.patients
      ]);
      const visitCounts = data.history.map((item) => [
        new Date(item.date).getTime(),
        item.visits
      ]);
      setPatientCountSeriesData(patientCounts.sort((a, b) => a[0] - b[0]));
      setVisitCountSeriesData(visitCounts.sort((a, b) => a[0] - b[0]));

      const seriesData = [];
      seriesData.push(
        {
          name: 'Visits',
          data: visitCountSeriesData,
          connectNulls: true,
          zoneAxis: 'x',
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
          name: 'Patients',
          data: patientCountSeriesData,
          connectNulls: true,
          zoneAxis: 'x',
          yAxis: 1,
          color: theme.palette.secondary.main,
          dataLabels: {
            enabled: true,
            x: 15,
            y: 20,
            color: theme.palette.secondary.main,
            style: {
              textOutline: 'none'
            }
          }
        } /*,
        {
          name: 'Patients Trend',
          data: calculateTrendline(patientCountSeriesData),
          connectNulls: true,
          zoneAxis: 'x',
          yAxis: 1,
          color: theme.palette.secondary.error,
          dataLabels: {
            enabled: true,
            x: 15,
            y: 20,
            color: theme.palette.secondary.error,
            style: {
              textOutline: 'none'
            }
          }
        }*/
      );

      //const trendlineData = calculateTrendline(patientCountSeriesData);

      setOptions({
        chart: {
          type: 'spline',
          height: 0.85 * height,
          style: {
            fontFamily: config.fontFamily
          },
          backgroundColor: theme.palette.background,
          accessibility: {
            enabled: false
          }
        },
        title: {
          text: '',
          align: 'left'
        },

        subtitle: {
          text: '',
          align: 'left'
        },

        yAxis: [
          {
            title: {
              text: 'Visits'
            }
          },
          {
            opposite: true,
            title: {
              text: 'Patients'
            }
          }
        ],

        xAxis: {
          type: 'datetime',
          title: {
            text: 'Dispatch Date'
          }
        },

        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
        },

        plotOptions: {
          series: {
            label: {
              connectorAllowed: true
            }
          }
        },
        series: seriesData,
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
    }
    //console.log(seriesData);
    setIsLoading(false);
  }, [isLoading]);

  return isLoading ? (
    <Box display="flex" justifyContent="center" my={6}>
      <CircularProgress />
    </Box>
  ) : (
    <HighchartsReact highcharts={Highcharts} options={options} />
  );
};

export default RecordGrowthChart;
