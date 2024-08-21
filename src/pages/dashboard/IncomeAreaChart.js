import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 0
  }
};
 
// ==============================|| INCOME AREA CHART ||============================== //
 
const IncomeAreaChart = ({ slot,visitorsDetail }) => {
  const theme = useTheme();
 
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;
 
  const [options, setOptions] = useState(areaChartOptions);
  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      xaxis: {
        categories: slot === 'month'
        ? visitorsDetail.currentYearData.map(item => item.month)
        : visitorsDetail.last7DaysData.map(item => item.day), // Use day names for week view
      labels: {
          style: {
            colors: Array.from({ length: slot === 'month' ? 12 : 7 }, () => secondary)
          }
        },
        axisBorder: {
          show: true,
          color: line
        },
        tickAmount: slot === 'month' ? 11 : 7
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      tooltip: {
        theme: 'light'
      }
    }));
  }, [primary, secondary, line, theme, slot, visitorsDetail]);
 
 
 
  const [series, setSeries] = useState([
    {
      name: 'Pilots',
      data: [0, 86, 28, 115, 48, 210, 136]
    },
    {
      name: 'Posters',
      data: [0, 43, 14, 56, 24, 105, 68]
    }
  ]);
 
  useEffect(() => {
    setSeries([
      {
        name: 'Pilots',
        data: slot === 'month'
          ? visitorsDetail.currentYearData.map(item => item.counts.Pilot)
          : visitorsDetail.last7DaysData.map(item => item.counts.Pilot)
      },
      {
        name: 'Posters',
        data: slot === 'month'
          ? visitorsDetail.currentYearData.map(item => item.counts.Poster)
          : visitorsDetail.last7DaysData.map(item => item.counts.Poster)
      }
    ]);
  }, [slot, visitorsDetail]);
  
  return <ReactApexChart options={options} series={series} type="area" height={450} />;
};
IncomeAreaChart.propTypes = {
  slot: PropTypes.string.isRequired,
  visitorsDetail: PropTypes.shape({
    last7DaysData: PropTypes.arrayOf(
      PropTypes.shape({
        day: PropTypes.string.isRequired,
        counts: PropTypes.number.isRequired
      })
    ).isRequired,
    currentYearData: PropTypes.arrayOf(
      PropTypes.shape({
        month: PropTypes.string.isRequired,
        counts: PropTypes.number.isRequired
      })
    ).isRequired
 
  }).isRequired
 
};
 
 
export default IncomeAreaChart;