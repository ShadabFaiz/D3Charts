import { BaseChart } from './BaseChart';
import * as d3 from 'd3';

export class HorizontalBarChart extends BaseChart {
  protected xScale: d3.ScaleLinear<number, number>;
  protected yScale: d3.ScaleBand<string>;

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

    // Add labels on hover.
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
      .attr('width', value => `${this.xScale(value)}`)
      .style(`fill`, `${this.backgroundColor}`)
      .attr(`height`, this.yScale.bandwidth())
      .attr(`y`, (data, index) => this.yScale(`${index}`))
      .transition()
      .duration(this.transitionDuration)
      .attr('width', data => `${this.xScale(data as number)}px`)
      .delay((d, i) => i * 50);

    // If new datas have less elements, then remove it.
    update.exit().remove();
  }

  private drawAxises(svg: d3.Selection<SVGGElement, {}, HTMLElement, any>, datas: number[]) {
    const labelsForData = datas.map((data, index) => index.toString());

    // X Axis
    this.xScale.domain([0, d3.max(datas)]);
    this.xAxis
      .transition()
      .duration(this.transitionDuration)
      .call(d3.axisBottom(this.xScale));

    // Y Axis
    this.yScale.domain(labelsForData);
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
      .style('transform', `translate(${this.spaceLeftForLeftAxis}px, 0px)`) as d3.Selection<
      SVGGElement,
      {},
      HTMLElement,
      any
    >;
  }

  private initializeScales(parent: { clientWidth: number; clientHeight: number }) {
    this.xScale = this.getLinearScale({
      upperLimit: parent.clientWidth - this.spaceLeftForLeftAxis,
    });
    this.yScale = d3
      .scaleBand()
      .range([this.spaceLeftonTop, parent.clientHeight + 5])
      .padding(0.2);
  }

  private createBars(
    svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
    xScale: d3.ScaleLinear<number, number>,
    yScale: d3.ScaleBand<string>,
    datas: number[]
  ) {
    const bars = svg
      .selectAll('g.group')
      .data(datas)
      .enter()
      .append(`rect`)
      .style(`transform`, (data, i) => `translateX(${this.spaceLeftForLeftAxis}px)`);

    bars
      .style(`fill`, `${this.backgroundColor}`)
      .attr(`width`, data => `0px`)
      .attr(`height`, yScale.bandwidth())
      .attr(`y`, (data, index) => yScale(`${index}`));

    bars
      .transition()
      .duration(this.transitionDuration)
      .attr('width', data => `${xScale(data as number)}px`)
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
