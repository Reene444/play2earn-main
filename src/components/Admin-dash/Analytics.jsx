import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import SearchableDropdown from "@/components/SearchableDropdown";
import './CSS/Analytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Analytics() {
  const [timeRange, setTimeRange] = useState("week");
  const [taskChartType, setTaskChartType] = useState("completed");
  const [userCount, setUserCount] = useState(null);
  const [tasksCompleted, setTasksCompleted] = useState(null);
  const [totalRewards, setTotalRewards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasksCompletedOverTime, setTasksCompletedOverTime] = useState([]);
  const [newUserRegistrations, setNewUserRegistrations] = useState([]);
  const [topTasks, setTopTasks] = useState([]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const userCountResponse = await axios.get('http://localhost:5002/api/user-count');
        setUserCount(userCountResponse.data.count);

        const tasksCompletedResponse = await axios.get('http://localhost:5002/api/tasks-completed');
        setTasksCompleted(tasksCompletedResponse.data.totalTasksCompleted);

        const totalRewardsResponse = await axios.get('http://localhost:5002/api/total-rewards');
        setTotalRewards(totalRewardsResponse.data.totalRewards);

        const response = await axios.get(`http://localhost:5002/api/tasks-completed-overtime?timeRange=${timeRange}`);
        setTasksCompletedOverTime(response.data);

        const newUserResponse = await axios.get('http://localhost:5002/api/new-user-registrations', {
          params: { timeRange: timeRange }  // Pass timeRange as a query parameter
        });
        setNewUserRegistrations(newUserResponse.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, [timeRange]);

  useEffect(() => {
    const fetchTopTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/top-tasks', {
          params: { type: taskChartType }
        });
        setTopTasks(response.data);
      } catch (error) {
        console.error('Error fetching top tasks:', error);
      }
    };

    fetchTopTasks();
  }, [taskChartType]);

  const getLabelsFromData = () => {
    if (timeRange === "week") {
      return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    } else if (timeRange === "month") {
      const numberOfWeeks = Math.max(5, Math.ceil(tasksCompletedOverTime.length / 7));
      return Array.from({ length: numberOfWeeks }, (_, i) => `Week ${i + 1}`);
    } else if (timeRange === "year") {
      return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    }
    return [];
  };

  const getTaskCompletionData = (data) => {
    return data.map(item => item.totalCompleted); // Extract the totalCompleted values for the dataset
  };

    const taskCompletionChartData = {
    labels: getLabelsFromData(tasksCompletedOverTime),
    datasets: [
      {
        label: "Tasks Completed",
        data: getTaskCompletionData(tasksCompletedOverTime),
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const getNewUserLabels = () => {
    if (timeRange === "week") {
      return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    } else if (timeRange === "month") {
      const numberOfWeeks = Math.max(5, Math.ceil(newUserRegistrations.length / 7));
      return Array.from({ length: numberOfWeeks }, (_, i) => `Week ${i + 1}`);
    } else if (timeRange === "year") {
      return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    }
    return [];
  };
  
  const getNewUserData = (data) => {
    return data.map(item => item.totalRegistrations); // Extract the totalRegistrations values for the dataset
  };
  
  const newUserChartData = {
    labels: getNewUserLabels(),  // Get labels based on time range
    datasets: [
      {
        label: "New User Registrations",
        data: getNewUserData(newUserRegistrations),  // Extract data from newUserRegistrations
        fill: false,
        borderColor: "rgba(255,99,132,1)",
      },
    ],
  };
  // const topTasksChartData = {
  //   labels: topTasks.map((task) => `${task.name} (${task.category})`),
  //   datasets: [
  //     {
  //       label: taskChartType === "completed" ? "Games Completed" : "Game Reward",
  //       data: topTasks.map((task) =>
  //         taskChartType === "completed" ? task.completed : task.reward
  //       ),
  //       backgroundColor: "rgba(54, 162, 235, 0.5)",
  //     },
  //   ],
  // };
  // const topTasksChartData = {
  //   labels: topTasks.map((task) => `${task.name || 'Game'} (${task.category || 'No Category'})`),
  //   datasets: [
  //     {
  //       label: taskChartType === "completed" ? "Games Completed" : "Game Reward",
  //       data: topTasks.map((task) =>
  //         taskChartType === "completed" ? (task.completed || 0) : (task.reward || 0)
  //       ),
  //       backgroundColor: "rgba(54, 162, 235, 0.5)",
  //     },
  //   ],
  // };

  const topTasksChartData = {
    labels: topTasks.map((task, index) => {
      const taskName = task.name || `Game ${index + 1}`;
      const category = task.category || "No Category";
      return `${taskName} (${category})`;
    }),
    datasets: [
      {
        label: taskChartType === "completed" ? "Games Completed" : "Game Reward",
        data: topTasks.map((task) => 
          taskChartType === "completed" ? (task.completed || 0) : (task.reward || 0)
        ),
        backgroundColor: topTasks.map((task) => 
          // Dynamically assign a color depending on the reward value, for example
          task.reward >= 100 ? "rgba(54, 162, 235, 0.5)" : "rgba(255, 159, 64, 0.5)"
          
        ),
      },
    ],
  };

  return (
    <div className="analytics-container">
      <h2 className="page-title">Analytics Dashboard</h2>

      <div className="summary-section">
        <div className="summary-card">
          <h3>Total Tasks Completed</h3>
          <p>{loading ? "Loading..." : tasksCompleted !== null ? tasksCompleted : "No Data"}</p>
        </div>
        <div className="summary-card">
          <h3>Total Users</h3>
          <p>{loading ? "Loading..." : userCount !== null ? userCount : "No Data"}</p>
        </div>
        <div className="summary-card">
          <h3>Total Rewards</h3>
          <p>{loading ? "Loading..." : totalRewards !== null ? totalRewards : "No Data"}</p>
        </div>
      </div>

      <div className="search-section">
        <SearchableDropdown />
      </div>

      <div className="filter-section">
        <select
          className="form-control"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Tasks Completed Over Time</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Line data={taskCompletionChartData} />
          )}
        </div>
        <div className="chart-card">
          <h3>New User Registrations</h3>
          {loading ? <p>Loading...</p> : <Line data={newUserChartData} />}
        </div>
        {/* <div className="chart-card">
          <h3>Total Rewards Over Time</h3>
          <Line data={totalRewardsChartData} />
        </div> */}
        <div className="chart-card">
          <h3>Top 5 Games</h3>
          <select
            className="form-control mb-2"
            value={taskChartType}
            onChange={(e) => setTaskChartType(e.target.value)}
          >
            <option value="completed">Most Completed</option>
            <option value="reward">Highest Reward</option>
          </select>
          <Bar data={topTasksChartData} />
        </div>
      </div>
    </div>
  );
}

export default Analytics;
