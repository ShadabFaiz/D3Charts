import { BaseChart } from './BaseChart';
import * as d3 from 'd3';

export class VerticalBarChart extends BaseChart {
  protected yScale: d3.ScaleLinear<number, number>;
  protected xScale: d3.ScaleBand<string>;

  protected yAxis: any;
  protected xAxis: any;

  protected readonly marginBetweenBars = 10;
  protected readonly widthOfChart = 20;

  constructor(datas: number[], idOfSVG: string) {
    super(idOfSVG);
    this.initializeScales(this.container);
    this.initializeXAxis(idOfSVG);
    this.initializeYAxis(idOfSVG);
  }

  public draw(datas: number[], idOfContainer: string) {
    // Group all the elements and appends new group for each dataset.
    const svg = d3.select(`#${idOfContainer}`).append('g');

    this.drawAxises(svg, datas);

    const bars = this.createBars(svg, this.xScale, this.yScale, datas);

    // // Add labels on hover.
    this.addToolTip(bars);
  }

  public updadteGraph(idOfSVG: string, newDatas: number[]) {
    const update = d3
      .select(`${idOfSVG}`)
      .selectAll('rect')
      .data(newDatas);
    this.drawAxises(update as any, newDatas);

    update
      .enter()
      .append('rect')
      .merge(update as any)
      .transition()
      .duration(this.transitionDuration)
      .attr('height', `${this.container.clientHeight + 5 - this.yScale(0)}px`)
      .style(`fill`, `${this.backgroundColor}`)
      .attr(`width`, this.xScale.bandwidth())
      .attr('x', (data, index) => this.xScale(`${index}`))
      .attr(`y`, this.yScale(0))
      .transition()
      .duration(this.transitionDuration)
      .attr('y', data => `${this.yScale(data)}`)
      .attr('height', data => `${this.container.clientHeight + 5 - this.yScale(data)}`)
      .delay((d, i) => i * 50);

    // If new datas have less elements, then remove it.
    update.exit().remove();
  }

  private drawAxises(svg: d3.Selection<SVGGElement, {}, HTMLElement, any>, datas: number[]) {
    const labelsForData = datas.map((data, index) => index.toString());

    // X Axis
    this.xScale.domain(labelsForData);
    this.xAxis
      .transition()
      .duration(this.transitionDuration)
      .call(d3.axisBottom(this.xScale));

    // Y Axis
    this.yScale.domain([0, d3.max(datas) + 1]);
    this.yAxis
      .transition()
      .duration(this.transitionDuration)
      .call(d3.axisLeft(this.yScale));
  }

  initializeXAxis(idOfContainer: string) {
    const svg = d3.select(`#${idOfContainer}`).append('g');
    this.xAxis = svg
      .append('g')
      .style('transform', `translate(${this.spaceLeftForLeftAxis}px, 95%)`) as d3.Selection<
      SVGGElement,
      {},
      HTMLElement,
      any
    >;
  }

  initializeYAxis(idOfContainer: string) {
    const svg = d3.select(`#${idOfContainer}`).append('g');
    this.yAxis = svg
      .append('g')
      // tslint:disable-next-line: max-line-length
      .style('transform', `translate(${this.spaceLeftForLeftAxis}px, 5px)`) as d3.Selection<
      SVGGElement,
      {},
      HTMLElement,
      any
    >;
  }

  private initializeScales(parent: { clientWidth: number; clientHeight: number }) {
    this.yScale = this.getLinearScale({
      upperLimit: this.spaceLeftonTop + 5,
      lowerLimit: parent.clientHeight,
    });
    this.xScale = d3
      .scaleBand()
      .range([0, parent.clientWidth - this.spaceLeftForLeftAxis])
      .padding(0.2);
  }

  private createBars(
    svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
    xScale: d3.ScaleBand<string>,
    yScale: d3.ScaleLinear<number, number>,
    datas: number[]
  ) {
    const bars = svg
      .selectAll('g.group')
      .data(datas)
      .enter()
      .append(`rect`)
      .style(`transform`, `translateX(${this.spaceLeftForLeftAxis}px)`);

    bars
      .style(`fill`, `${this.backgroundColor}`)
      .attr(`width`, xScale.bandwidth())
      .attr(`height`, `${this.container.clientHeight + 5 - yScale(0)}px`)
      .attr(`x`, (data, index) => xScale(`${index}`))
      .attr('y', `${yScale(0)}`);

    bars
      .transition()
      .duration(this.transitionDuration)
      .attr('y', data => `${yScale(data)}`)
      .attr('height', data => `${this.container.clientHeight + 5 - yScale(data)}`)
      .delay((d, i) => i * 50);
    return bars;
  }

  private addToolTip(bars: d3.Selection<any, number, d3.BaseType, {}>) {
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip');
    bars
      .on('mouseover', function(d) {
        d3.select(this)
          .transition()
          .duration(this.transitionDuration * 0.2)
          .style('fill', 'red');
        return tooltip.style('visibility', 'visible').text(`value: ${d}`);
      })
      .on('mousemove', () => {
        return tooltip
          .style('top', d3.event.pageY - 30 + 'px')
          .style('left', d3.event.pageX + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(this.transitionDuration * 0.2)
          .style('fill', `green`);
        return tooltip.style('visibility', 'hidden');
      });
  }
}
