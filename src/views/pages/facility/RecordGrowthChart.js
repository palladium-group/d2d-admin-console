import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import useConfig from 'hooks/useConfig';
import { useTheme } from '@mui/material/styles';

const RecordGrowthChart = ({ height, data }) => {
  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const monthNames = [
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
  ];

  const config = useConfig();
  const theme = useTheme();

  function formatDateToMonthYear(dateStr) {
    const date = new Date(dateStr);
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  }

  useEffect(() => {
    if (data.history && data.history.length > 0) {
      //console.log(data);
      const seriesData = [];
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const category = [];
      let startYear;
      if (currentMonth < 11) {
        const startMonth = 11 - currentMonth;
        for (let i = startMonth; i <= 11; i++) {
          startYear = currentYear - 1;
          category.push(monthNames[i] + ' ' + startYear);
        }
        for (let j = 0; j <= currentMonth; j++) {
          category.push(monthNames[j] + ' ' + currentYear);
        }
      } else {
        for (let j = 0; j <= currentMonth; j++) {
          category.push(monthNames[j] + ' ' + currentYear);
        }
      }

      const visits = [];
      const patients = [];
      for (let i = 0; i < 12; i++) {
        const res = data.history.filter(
          (obj) => formatDateToMonthYear(obj.date) === category[i]
        );
        if (res.length > 0) {
          visits.push(res[0].visits);
          patients.push(res[0].patients);
        } else {
          visits.push(null);
          patients.push(null);
        }
      }
      seriesData.push(
        {
          name: 'Visits',
          data: visits,
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
          data: patients,
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
        }
      );
      setSeries(seriesData);
      setCategories(category);
    }
  }, [data]);

  useEffect(() => {
    setOptions({
      chart: {
        type: 'spline',
        height: 0.85 * height,
        style: {
          fontFamily: config.fontFamily
        },
        backgroundColor: theme.palette.background
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
        accessibility: {
          rangeDescription: 'Months'
        },
        categories: categories
      },

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
      series: series,
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
  }, [categories, series]);
  return series.length === 0 ? (
    <Box display="flex" justifyContent="center" my={6}>
      <CircularProgress />
    </Box>
  ) : (
    <HighchartsReact highcharts={Highcharts} options={options} />
  );
};

export default RecordGrowthChart;
