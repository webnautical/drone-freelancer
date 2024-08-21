import { useState } from 'react';

import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import OrdersTable from '../../utils/Usermanagement';
import IncomeAreaChart from './IncomeAreaChart';
import MonthlyBarChart from './MonthlyBarChart';

import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import config from 'config';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  // const [value, setValue] = useState('today');
  const [loading, setLoading] = useState(false);
  const [slot, setSlot] = useState('week');

  const [visitorsDetail, setVisitorsDetail] = useState({ currentYearData: [], last7DaysData: [] });
  const [allIncome, setAllIncome] = useState({
    weeklyData: {},
    totalAmount: 0
  });
  const [dashboardStatistics, setDashboardStatistics] = useState({
    RegisteredUsers: '',
    FinancialTransaction: '',
    PostedJobs: '',
    AwardedJobs: '',
    PendingpilotApprovals: '',
  })


  const visitorDetailRecored = async () => {
    try {
      const response = await fetch(`${config.url}/admin/visitorsDetail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      //console.log("Data", data);

      if (data.message === true) {
        setVisitorsDetail({
          currentYearData: data.currentYearData,
          last7DaysData: data.last7DaysData
        });
      }

      //  console.log(visitorsDetail, 'visitor detail');
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const allIncomeRecord = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${config.url}/admin/getAllIncome`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      //console.log("Data", data);

      if (data.message === true) {
        setAllIncome({
          weeklyData: data.weeklyData,
          totalAmount: data.totalAmount
        });
        setLoading(false)
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false)
    }
  }
  const getDashboardStatistics = async () => {
    try {
      const response = await fetch(`${config.url}/admin/dashboardStatistics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json();
      console.log("Data", data);



      setDashboardStatistics({
        RegisteredUsers: data.totalRegisteredUsers,
        FinancialTransaction: data.totalFinancialTransaction,
        PostedJobs: data.totalPostedJobs,
        AwardedJobs: data.totalAwardedJobs,
        PendingpilotApprovals: data.PendingpilotApprovals
      })


    } catch (error) {
      console.log(error);
    }
  };
  console.log(dashboardStatistics, 'dssss')
  useEffect(() => {

    visitorDetailRecored();
    allIncomeRecord();
    getDashboardStatistics();
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>

      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4} className="multi_box">
        <AnalyticEcommerce
          title="Pending pilot Approvals"
          count={dashboardStatistics.PendingpilotApprovals}
        //  percentage={59.3}
        // extra="35,000"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4} className="multi_box">
        <AnalyticEcommerce
          title="Total Registered Users"
          count={dashboardStatistics.RegisteredUsers}
          //  percentage={70.5}
          extra="8,900"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4} className="multi_box">
        <AnalyticEcommerce
          title="Total Financial Transaction "
          count={dashboardStatistics.FinancialTransaction}
          //  percentage={27.4}
          isLoss
          color="warning"
          extra="1,943"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4} className="multi_box">
        <AnalyticEcommerce
          title="Total Posted Jobs"
          count={dashboardStatistics.PostedJobs}
          //  percentage={27.4}
          isLoss
          color="warning"
          extra="$20,395"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4} className="multi_box">
        <AnalyticEcommerce
          title="Total Awarded Jobs"
          count={dashboardStatistics.AwardedJobs}
          //  percentage={27.4}
          isLoss
          color="warning"
          extra="$20,395"
        />
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      <Grid item xs={12} md={12} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Unique Visitor
            </Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
              <Button
                size="small"
                onClick={() => setSlot('month')}
                color={slot === 'month' ? 'primary' : 'secondary'}
                variant={slot === 'month' ? 'outlined' : 'text'}
              >
                Month
              </Button>
              <Button
                size="small"
                onClick={() => setSlot('week')}
                color={slot === 'week' ? 'primary' : 'secondary'}
                variant={slot === 'week' ? 'outlined' : 'text'}
              >
                Week
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <IncomeAreaChart slot={slot} visitorsDetail={visitorsDetail} />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={12} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Income Overview</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="textSecondary">
                This Week Statistics
              </Typography>
              <Typography variant="h3">{allIncome.totalAmount} AUD</Typography>
            </Stack>
          </Box>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <MonthlyBarChart allIncome={allIncome} />
          )}
        </MainCard>
      </Grid>



      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Recent Registered Pilot</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable />
        </MainCard>
      </Grid>

    </Grid>
  );
};

export default DashboardDefault;