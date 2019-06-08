import * as d3 from 'd3';
import { IRangeLimits } from '../models/IRangeModel';

export abstract class BaseChart {
  protected readonly backgroundColor = 'green';
  protected spaceLeftonTop = 25;
  protected spaceLeftForLeftAxis = 25;
  protected spaceLeftOnBottomAxix = 25;
  protected readonly transitionDuration = 1000;
  protected container: { clientWidth: number; clientHeight: number };

  constructor(idOfSVG: string) {
    const element = (document.getElementById(idOfSVG) as unknown) as SVGElement;
    this.initializeContainer(element);
  }

  protected abstract xScale: any;

  abstract draw(...args): any;
  abstract initializeXAxis(...args): any;
  abstract initializeYAxis(...args): any;

  protected calculateContainerDimension(container: SVGElement) {
    return {
      clientHeight: container.clientHeight - this.spaceLeftOnBottomAxix,
      clientWidth: container.clientWidth - this.spaceLeftForLeftAxis,
    };
  }

  protected getLinearScale({
    lowerLimit = 0,
    upperLimit = 0,
  }: IRangeLimits): d3.ScaleLinear<number, number> {
    return d3.scaleLinear().range([lowerLimit, upperLimit]);
  }

  protected initializeContainer(element: SVGElement) {
    this.container = this.calculateContainerDimension(element);
  }
}
