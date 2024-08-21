import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
 
// ==============================|| MONTHLY BAR CHART ||============================== //
 
const MonthlyBarChart = ({ allIncome }) => {
  const theme = useTheme()
  const { primary, secondary } = theme.palette.text;
  const info = theme.palette.info.light;
  const [series, setSeries] = useState([
    { name: 'amount',
      data: [0, 0, 0, 0, 0, 0, 0]
    }
  ]);
 
  const [options, setOptions] = useState({
    chart: {
      type: 'bar',
      height: 365,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '45%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: Object.keys(allIncome?.weeklyData || {}).map(day => day.substring(0, 2)),
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: false
    },
    grid: {
      show: false
    }
  });
  
  useEffect(() => {
    if (allIncome && allIncome?.weeklyData) {
      setSeries([
        {
          data: Object.values(allIncome?.weeklyData)
        }
      ]);
    }
 
    setOptions(prevState => ({
      ...prevState,
      colors: [info],
      xaxis: {
        labels: {
          style: {
            colors: [secondary, secondary, secondary, secondary, secondary, secondary, secondary]
          }
        }
      },
      tooltip: {
        theme: 'light'
      }
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allIncome, primary, info, secondary]);
 
  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="bar" height={365} />
    </div>
  );
};
 
MonthlyBarChart.propTypes = {
  allIncome: PropTypes.shape({
    totalAmount: PropTypes.number.isRequired,
    weeklyData: PropTypes.shape({
      Friday: PropTypes.number.isRequired,
      Monday: PropTypes.number.isRequired,
      Saturday: PropTypes.number.isRequired,
      Sunday: PropTypes.number.isRequired,
      Thursday: PropTypes.number.isRequired,
      Tuesday: PropTypes.number.isRequired,
      Wednesday: PropTypes.number.isRequired
    }).isRequired
  }).isRequired
};
 
export default MonthlyBarChart;