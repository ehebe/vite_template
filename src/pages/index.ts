import {
  CategoryScale,
  Chart,
  Colors,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
} from "chart.js";

// 注册所需的组件
Chart.register(
  CategoryScale,
  PointElement,
  LinearScale,
  LineElement,
  LineController,
  Colors,
  Legend
);

(() => {
  const ctx = document.getElementById("canvas") as HTMLCanvasElement;
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1,
        },
      ],
    },
  });
})();
