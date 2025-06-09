// // 'use client';
// // import React, { useEffect, useRef } from 'react';
// // import * as Chart from 'chart.js';

// // const Progress = () => {
// //   const groupsChartRef = useRef(null);
// //   const skillsChartRef = useRef(null);
// //   const ageChartRef = useRef(null);

// //   // Skills labels data
// //   const skillsLabels = [
// //     { name: 'Speech', percentage: '20%', style: { top: '15px', right: '25px' } },
// //     { name: 'Decision Making', percentage: '20%', style: { top: '15px', left: '15px' } },
// //     { name: 'Creative', percentage: '40%', style: { bottom: '25px', left: '25px' } },
// //     { name: 'Locomotor', percentage: '20%', style: { bottom: '15px', right: '35px' } }
// //   ];

// //   // Age group labels data
// //   const ageLabels = [
// //     { name: '3 yrs - 4 yrs', percentage: '42.9%', style: { top: '25px', right: '15px' } },
// //     { name: '3 yrs - 5 yrs', percentage: '28.6%', style: { top: '35px', left: '10px' } },
// //     { name: '3 yrs - 5 yrs', percentage: '14.3%', style: { bottom: '35px', left: '25px' } },
// //     { name: '2 yrs - 7 yrs', percentage: '14.3%', style: { bottom: '25px', right: '25px' } }
// //   ];

// //   useEffect(() => {
// //     // Register Chart.js components
// //     Chart.Chart.register(
// //       Chart.ArcElement,
// //       Chart.Tooltip,
// //       Chart.Legend,
// //       Chart.DoughnutController
// //     );

// //     // Common chart options
// //     const commonOptions = {
// //       responsive: true,
// //       maintainAspectRatio: false,
// //       plugins: {
// //         legend: {
// //           display: false
// //         },
// //         tooltip: {
// //           enabled: false
// //         }
// //       },
// //       cutout: '60%'
// //     };

// //     // Groups chart
// //     const groupsChart = new Chart.Chart(groupsChartRef.current, {
// //       type: 'doughnut',
// //       data: {
// //         datasets: [{
// //           data: [100],
// //           backgroundColor: ['#F4D03F'],
// //           borderWidth: 0
// //         }]
// //       },
// //       options: commonOptions
// //     });

// //     // Skills chart
// //     const skillsChart = new Chart.Chart(skillsChartRef.current, {
// //       type: 'doughnut',
// //       data: {
// //         datasets: [{
// //           data: [20, 20, 40, 20],
// //           backgroundColor: ['#FFDE59', '#B0C14E', '#6BA14B', '#347E49'],
// //           borderWidth: 0
// //         }]
// //       },
// //       options: commonOptions
// //     });

// //     // Age group chart
// //     const ageChart = new Chart.Chart(ageChartRef.current, {
// //       type: 'doughnut',
// //       data: {
// //         datasets: [{
// //           data: [42.9, 14.3, 14.3, 28.6],
// //           backgroundColor: ['#FFDE59', '#B0C14E', '#6BA14B', '#347E49'],
// //           borderWidth: 0
// //         }]
// //       },
// //       options: commonOptions
// //     });

// //     // Cleanup function
// //     return () => {
// //       groupsChart.destroy();
// //       skillsChart.destroy();
// //       ageChart.destroy();
// //     };
// //   }, []);

// //   const ChartCard = ({ title, chartRef, showCenter = false, centerValue = null, labels = null }) => (
// //     <div className="bg-white rounded-lg border border-gray-200 p-6 flex-1 min-w-0">
// //       <h3 className="text-sm font-medium text-gray-700 mb-6 text-left">{title}</h3>
// //       <div className="relative h-64 flex justify-center items-center">
// //         <canvas ref={chartRef} width="200" height="200"></canvas>
// //         {showCenter && (
// //           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
// //             <span className="text-5xl font-bold text-gray-900">{centerValue}</span>
// //           </div>
// //         )}
// //         {labels && (
// //           <div className="absolute inset-0 pointer-events-none">
// //             {labels.map((label, index) => (
// //               <div
// //                 key={index}
// //                 className="absolute text-sm text-gray-600"
// //                 style={label.style}
// //               >
// //                 <div className="text-center">
// //                   <div className="font-medium">{label.name}</div>
// //                   <div>{label.percentage}</div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );

// //   return (
// //     <div className="flex gap-3 w-full">
// //       <ChartCard 
// //         title="Activities : Groups" 
// //         chartRef={groupsChartRef}
// //         showCenter={true}
// //         centerValue="5"
// //       />
// //       <ChartCard 
// //         title="Activities : Skills Required" 
// //         chartRef={skillsChartRef}
// //         labels={skillsLabels}
// //       />
// //       <ChartCard 
// //         title="Activities : Age Group" 
// //         chartRef={ageChartRef}
// //         labels={ageLabels}
// //       />
// //     </div>
// //   );
// // };

// // export default Progress;
// 'use client';
// import React, { useEffect, useRef } from 'react';
// import * as Chart from 'chart.js';

// const Progress = () => {
//   const groupsChartRef = useRef(null);
//   const skillsChartRef = useRef(null);
//   const ageChartRef = useRef(null);

//   useEffect(() => {
//     // Register Chart.js components
//     Chart.Chart.register(
//       Chart.ArcElement,
//       Chart.Tooltip,
//       Chart.Legend,
//       Chart.DoughnutController
//     );

//     // Common chart options
//     const commonOptions = {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           display: true,
//           position: 'bottom',
//           align: 'center',
//           labels: {
//             usePointStyle: true,
//             pointStyle: 'circle',
//             padding: 10,
//             font: {
//               size: 11
//             },
//             boxHeight: 8,
//             boxWidth: 8,
//             generateLabels: function(chart) {
//               const data = chart.data;
//               if (data.labels && data.datasets.length) {
//                 return data.labels.map((label, i) => {
//                   const dataset = data.datasets[0];
//                   const value = dataset.data[i];
//                   const percentage = chart.config.options.plugins.legend.labels.formatter 
//                     ? chart.config.options.plugins.legend.labels.formatter(value, chart.data)
//                     : `${value}%`;
                  
//                   return {
//                     text: `${label}: ${percentage}`,
//                     fillStyle: dataset.backgroundColor[i],
//                     strokeStyle: dataset.backgroundColor[i],
//                     pointStyle: 'circle',
//                     hidden: false,
//                     index: i
//                   };
//                 });
//               }
//               return [];
//             }
//           }
//         },
//         tooltip: {
//           callbacks: {
//             label: function(context) {
//               return `${context.label}: ${context.parsed}%`;
//             }
//           }
//         }
//       },
//       cutout: '60%'
//     };

//     // Groups chart - simpler single segment
//     const groupsChart = new Chart.Chart(groupsChartRef.current, {
//       type: 'doughnut',
//       data: {
//         labels: ['Groups'],
//         datasets: [{
//           data: [100],
//           backgroundColor: ['#F4D03F'],
//           borderWidth: 0
//         }]
//       },
//       options: {
//         ...commonOptions,
//         plugins: {
//           ...commonOptions.plugins,
//           legend: {
//             display: false // Hide legend for single value chart
//           }
//         }
//       }
//     });

//     // Skills chart
//     const skillsChart = new Chart.Chart(skillsChartRef.current, {
//       type: 'doughnut',
//       data: {
//         labels: ['Speech', 'Decision Making', 'Creative', 'Locomotor'],
//         datasets: [{
//           data: [20, 20, 40, 20],
//           backgroundColor: ['#FFDE59', '#B0C14E', '#6BA14B', '#347E49'],
//           borderWidth: 0
//         }]
//       },
//       options: commonOptions
//     });

//     // Age group chart
//     const ageChart = new Chart.Chart(ageChartRef.current, {
//       type: 'doughnut',
//       data: {
//         labels: ['3-4 yrs', '3-5 yrs', '3-5 yrs', '2-7 yrs'],
//         datasets: [{
//           data: [42.9, 28.6, 14.3, 14.3],
//           backgroundColor: ['#FFDE59', '#B0C14E', '#6BA14B', '#347E49'],
//           borderWidth: 0
//         }]
//       },
//       options: commonOptions
//     });

//     // Cleanup function
//     return () => {
//       groupsChart.destroy();
//       skillsChart.destroy();
//       ageChart.destroy();
//     };
//   }, []);

//   const ChartCard = ({ title, chartRef, showCenter = false, centerValue = null }) => (
//     <div className="bg-white rounded-lg border border-gray-700 py-6  flex-1 min-w-0">
//       <h3 className="text-sm font-medium border-b border-gray-700  text-gray-700 mb-6 text-center">{title}</h3>
//       <div className="relative h-80 flex justify-center items-center">
//         <canvas ref={chartRef} width="200" height="200"></canvas>
//         {showCenter && (
//           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//             <span className="text-5xl font-bold text-gray-900">{centerValue}</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="flex gap-3 w-full">
//       <ChartCard 
//         title="Activities : Groups" 
//         chartRef={groupsChartRef}
//         showCenter={true}
//         centerValue="5"
//       />
//       <ChartCard 
//         title="Activities : Skills Required" 
//         chartRef={skillsChartRef}
//       />
//       <ChartCard 
//         title="Activities : Age Group" 
//         chartRef={ageChartRef}
//       />
//     </div>
//   );
// };

// export default Progress;

'use client';
import React, { useEffect, useRef } from 'react';
import * as Chart from 'chart.js';

const Progress = () => {
  const groupsChartRef = useRef(null);
  const skillsChartRef = useRef(null);
  const ageChartRef = useRef(null);
  const sessionsChartRef = useRef(null);

  useEffect(() => {
    // Register Chart.js components
    Chart.Chart.register(
      Chart.ArcElement,
      Chart.Tooltip,
      Chart.Legend,
      Chart.DoughnutController,
      Chart.LineController,
      Chart.LineElement,
      Chart.PointElement,
      Chart.CategoryScale,
      Chart.LinearScale,
      Chart.Filler
    );

    // Common chart options for doughnut charts
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          align: 'center',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 10,
            font: {
              size: 11
            },
            boxHeight: 8,
            boxWidth: 8,
            generateLabels: function(chart) {
              const data = chart.data;
              if (data.labels && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const dataset = data.datasets[0];
                  const value = dataset.data[i];
                  const percentage = chart.config.options.plugins.legend.labels.formatter 
                    ? chart.config.options.plugins.legend.labels.formatter(value, chart.data)
                    : `${value}%`;
                  
                  return {
                    text: `${label}: ${percentage}`,
                    fillStyle: dataset.backgroundColor[i],
                    strokeStyle: dataset.backgroundColor[i],
                    pointStyle: 'circle',
                    hidden: false,
                    index: i
                  };
                });
              }
              return [];
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed}%`;
            }
          }
        }
      },
      cutout: '60%'
    };

    // Groups chart - simpler single segment
    const groupsChart = new Chart.Chart(groupsChartRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Groups'],
        datasets: [{
          data: [100],
          backgroundColor: ['#F4D03F'],
          borderWidth: 0
        }]
      },
      options: {
        ...commonOptions,
        plugins: {
          ...commonOptions.plugins,
          legend: {
            display: false // Hide legend for single value chart
          }
        }
      }
    });

    // Skills chart
    const skillsChart = new Chart.Chart(skillsChartRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Speech', 'Decision Making', 'Creative', 'Locomotor'],
        datasets: [{
          data: [20, 20, 40, 20],
          backgroundColor: ['#FFDE59', '#B0C14E', '#6BA14B', '#347E49'],
          borderWidth: 0
        }]
      },
      options: commonOptions
    });

    // Age group chart
    const ageChart = new Chart.Chart(ageChartRef.current, {
      type: 'doughnut',
      data: {
        labels: ['3-4 yrs', '3-5 yrs', '3-5 yrs', '2-7 yrs'],
        datasets: [{
          data: [42.9, 28.6, 14.3, 14.3],
          backgroundColor: ['#FFDE59', '#B0C14E', '#6BA14B', '#347E49'],
          borderWidth: 0
        }]
      },
      options: commonOptions
    });

    // Sessions line chart
    const sessionsChart = new Chart.Chart(sessionsChartRef.current, {
      type: 'line',
      data: {
        labels: ['13 May 2022', '14 May 2022', '15 May 2022', '16 May 2022', '17 May 2022'],
        datasets: [{
          data: [18, 26, 24, 36, 28],
          borderColor: '#7DD3FC',
          backgroundColor: 'transparent',
          borderWidth: 2,
          fill: false,
          tension: 0,
          pointRadius: 4,
          pointBackgroundColor: '#7DD3FC',
          pointBorderColor: '#7DD3FC'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Sessions: ${context.parsed.y}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: '#E5E7EB'
            },
            ticks: {
              font: {
                size: 11
              },
              color: '#6B7280'
            },
            offset: true
          },
          y: {
            beginAtZero: true,
            max: 40,
            grid: {
              display: true,
              color: '#E5E7EB'
            },
            ticks: {
              stepSize: 10,
              font: {
                size: 11
              },
              color: '#6B7280'
            }
          }
        }
      }
    });

    // Cleanup function
    return () => {
      groupsChart.destroy();
      skillsChart.destroy();
      ageChart.destroy();
      sessionsChart.destroy();
    };
  }, []);

  const ChartCard = ({ title, chartRef, showCenter = false, centerValue = null }) => (
    <div className="bg-white rounded-lg border border-gray-700 py-6 flex-1 min-w-0">
      <h3 className="text-sm font-medium border-b border-gray-700 text-gray-700 pb-1  mb-6 text-center">{title}</h3>
      <div className="relative h-80 flex justify-center items-center">
        <canvas ref={chartRef} width="200" height="200"></canvas>
        {showCenter && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-5xl font-bold text-gray-900">{centerValue}</span>
          </div>
        )}
      </div>
    </div>
  );

  const SessionsCard = () => (
    <div className="bg-white rounded-lg border border-gray-700 p-6 px-0 w-full mt-6">
      <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mx-6">Sessions</h2>
        <select className="text-sm border border-gray-300 rounded mx-6 px-3 py-1 text-gray-600">
          <option>Last 30 days</option>
        </select>
      </div>
      
      <div className="relative mx-64 h-96 mb-6">
        <canvas ref={sessionsChartRef}></canvas>
      </div>
      
      <div className="flex justify-center gap-44">
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-600 mb-1">Total Sessions</div>
          <div className="text-2xl font-bold text-[#4378a4]">12</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-600 mb-1">Average Duration</div>
          <div className="text-2xl font-bold text-[#4378a4]">00h45m</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex gap-3 w-full">
        <ChartCard 
          title="Activities : Groups" 
          chartRef={groupsChartRef}
          showCenter={true}
          centerValue="5"
        />
        <ChartCard 
          title="Activities : Skills Required" 
          chartRef={skillsChartRef}
        />
        <ChartCard 
          title="Activities : Age Group" 
          chartRef={ageChartRef}
        />
      </div>
      
      <SessionsCard />
    </div>
  );
};

export default Progress;