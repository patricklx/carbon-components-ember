import { PieChart } from '@carbon/charts';
import Component from '@ember/component';
import { action } from '@ember/object';
import { throttle } from '@ember/runloop';

/**
 The CarbonPieChart

 @class CarbonPieChart
 @public
 @yield {Object} api
 @yield {Component} api.DataSet <a href='-components/dataset' >Dataset</a>
 @yield {Component} api.Axis <a href='-components/axis' >ChartAxis</a>
 **/
class CarbonPieChart extends Component {
  tagName = '';
  data = {
    labels: [],
    datasets: []
  };
  options = {
    axes: {},
    legendClickable: true,
    containerResizable: true
  };
  legendClickable = true;
  containerResizable = true;


  setData() {
    this.data.labels = Array.isArray(this.labels) ? this.labels : this.labels.split(',');
    this.options.legendClickable = this.legendClickable;
    this.options.containerResizable = this.containerResizable;
    if (!this.data.datasets.length) return;
    if (!this.options.axes.left) return;
    if (!this.options.axes.bottom) return;
    if (!this.chart) {
      this.chart = new PieChart(this.chartDiv, {
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

export default CarbonPieChart;
