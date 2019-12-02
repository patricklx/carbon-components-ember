import Component from '@ember/component';

/** @documenter yuidoc */
/**
 The ChartAxis

 ```handlebars
 ```
 @class ChartAxis
 @public
 **/
class ChartAxis extends Component {
  tagName = '';
  chart = null;

  args = {
    /**
     * The Axis Title
     * @argument title
     * @type String
     */
    title: '',
    /**
     * @argument stacked
     * @type boolean
     */
    stacked: false,
    /**
     * @argument primary
     * @type boolean
     */
    primary: false,
    /**
     * @argument secondary
     * @type boolean
     */
    secondary: false,
    /**
     * @argument scaleType
     * @type String
     */
    scaleType: null
  }
}

export default ChartAxis;
