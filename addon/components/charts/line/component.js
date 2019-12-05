import { LineChart } from '@carbon/charts';
import Component from '@ember/component';
import { action } from '@ember/object';
import { throttle } from '@ember/runloop';

/**
 The CarbonLineChart

 @class CarbonLineChart
 @public
 @yield {Object} api
 @yield {Component} api.DataSet <a href='-components/dataset' >Dataset</a>
 @yield {Component} api.Axis <a href='-components/axis' >ChartAxis</a>
 **/
class CarbonLineChart extends Component {
  tagName = '';
  data = {
    labels: [],
    datasets: []
  };
  options = {
    axes: {},
    legendClickable: true,
    resizable: true,
    timeScale: {
      addSpaceOnEdges: false
    }
  };
  legendClickable = true;
  resizable = true;


  setData() {
    this.data.labels = Array.isArray(this.labels) ? this.labels : this.labels.split(',');
    this.options.legendClickable = this.legendClickable;
    this.options.resizable = true;
    if (!this.data.datasets.length) return;
    if (!this.options.axes.left) return;
    if (!this.options.axes.bottom) return;
    if (!this.chart) {
      this.chart = new LineChart(this.chartDiv, {
        options: this.options,
        data: this.data
      });
    }
    this.chart.update();
  }

  @action
  loadChart() {
    this.setData();
  }

  update() {
    this.setData();
  }

  @action
  updateChart() {
    throttle(this, this.update, 250);
  }

  @action
  destroyChart() {
    this.chart && this.chart.destroy();
  }

  @action
  setAxis(axis, options) {
    this.options.axes = Object.assign(this.options.axes, {}, {
      [axis]: options
    });
    this.updateChart();
  }

  @action
  removeDataset(label) {
    const dataset = this.data.datasets.find(d => d.label === label);
    this.data.datasets.removeObject(dataset);
    this.updateChart();
  }

  @action
  updateDataset(label, backgroundColors, data) {
    if (!label || !data) return;
    let dataset = this.data.datasets.find(d => d.label === label);
    if (!dataset) {
      dataset = { };
      this.data.datasets.push(dataset);
    }
    Object.assign(dataset, { label, backgroundColors, data });
    this.updateChart();
  }
}

export default CarbonLineChart;
