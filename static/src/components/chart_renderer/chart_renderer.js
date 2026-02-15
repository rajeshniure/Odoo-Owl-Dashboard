/** @odoo-module */

import { registry } from "@web/core/registry";
import { loadJS } from "@web/core/assets";
const { Component, onWillStart, useRef, onMounted } = owl;

export class ChartRenderer extends Component {
  setup() {
    this.chartRef = useRef("chart");
    onWillStart(async () => {
      await loadJS(
        "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js",
      );
    });

    onMounted(() => this.renderChart());
  }

  renderChart() {
    new Chart(this.chartRef.el, {
      type: this.props.type,
      data: {
        labels: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        datasets: [
          {
            label: "Incoming",
            data: [120, 145, 90, 200, 160, 50, 30],
            hoverOffset: 4,
            tension: 0.4,
            backgroundColor: "#18B37D",
            borderColor: "#18B37D",
          },
          {
            label: "Outgoing",
            data: [80, 100, 110, 150, 130, 40, 20],
            hoverOffset: 4,
            tension: 0.4,
            backgroundColor: "#EE9914",
            borderColor: "#EE9914",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  }
}

ChartRenderer.template = "owl.ChartRenderer";

export class BarRenderer extends Component {
  setup() {
    this.chartRef = useRef("chart");
    onWillStart(async () => {
      await loadJS(
        "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js",
      );
    });

    onMounted(() => this.renderBar());
  }

  renderBar() {
    new Chart(this.chartRef.el, {
      type: this.props.type,
      data: {
        labels: ["MainWH", "East Side", "Returns", "Scrap"],
        datasets: [
          {
            label: "Quantity",
            data: [8500, 3200, 450, 120],
            hoverOffset: 4,
            backgroundColor: ["#3D7EEF", "#6164EA", "#EE9914", "#E84646"],
            borderColor: ["#3D7EEF", "#6164EA", "#EE9914", "#E84646"],
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  }
}

BarRenderer.template = "owl.BarRenderer";

export class WarehouseProgressCard extends Component {
  // Logic to calculate percentage if not provided
  getZonePercent(zone) {
    if (zone.percent) return zone.percent;
    // Optional: calculate based on a max capacity
    const max = 1500;
    return Math.min((zone.value / max) * 100, 100);
  }
}

WarehouseProgressCard.template = "my_module.WarehouseProgressCard";
