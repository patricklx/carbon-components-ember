import { defaultColors } from '@carbon/charts';
import Component from '@ember/component';

/** @documenter yuidoc */
/**
 The CarbonChartDataSet

 ```handlebars
 ```
 @class CarbonChartDataSet
 @public
 **/
class CarbonChartDataSet extends Component {
  tagName = '';
  chart = null;
  defaultColor = [defaultColors[0]];

  args = {
    /**
     * The Dataset label
     * @argument label
     * @type String
     */
      label: '',
    /**
     * @argument backgroundColors
     * @type defaultColors[]
     */
      backgroundColors: [],
    /**
     * @argument data
     * @type number[]
     */
      data: []
  }
}

export default CarbonChartDataSet;
