import { Bar, Line } from "react-chartjs-2";

function MyBarChart({ data, title }) {
  return (
    <Bar 
      data={data}
      options={{
        plugins: {
          title: {
            display: true,
            text: title,
          },
          legend: {
            display: false,
          },
        },
      }}
    />
  );
}

function MyLineChart({ data, title }) {
  return (
    <Line
      data={data}
      options={{
        plugins: {
          title: {
            display: true,
            text: title,
          },
          legend: {
            display: false,
          },
        },
      }}
    />
  );
}

export { MyBarChart as BarChart, MyLineChart as LineChart };