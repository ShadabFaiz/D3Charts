import { BaseChart } from './BaseChart';
import * as d3 from 'd3';
import { IStackBarData } from '../models/IStackBarData';
import { SeriesPoint } from 'd3';

export class StackedBarChart extends BaseChart {
  protected yScale: d3.ScaleLinear<number, number>;
  protected xScale: d3.ScaleBand<string>;

  protected yAxis: any;
  protected xAxis: any;

  protected readonly marginBetweenBars = 10;
  protected readonly widthOfChart = 20;

  protected color;

  constructor(datas: IStackBarData[], idOfSVG: string) {
    super(idOfSVG);
    this.initializeScales(this.container);
    this.initializeXAxis(idOfSVG);
    this.initializeYAxis(idOfSVG);
    this.initializeColor();
  }

  initializeColor() {
    this.color = d3.scaleOrdinal().range(d3.schemeSet2);
  }

  public draw(datas: IStackBarData[], idOfContainer: string) {
    // Group all the elements and appends new group for each dataset.
    const svg = d3.select(`#${idOfContainer}`).append('g');

    this.drawLabels(datas, idOfContainer);

    this.drawAxises(svg, datas);

    const bars = this.createBars(svg, this.xScale, this.yScale, datas);

    // // // Add labels on hover.
    this.addToolTip(bars);
  }

  drawLabels(datas: IStackBarData[], idOfContainer: string) {
    const labelNames = Object.keys(datas[0]).filter(key => key !== 'country');
    const legends = d3
      .select(`#${idOfContainer}`)
      .selectAll('myDots')
      .append('g')
      .data(labelNames)
      .enter()
      .append('g')
      .style(
        'transform',
        (data, index) => `translate(${this.container.clientWidth - 100}px, ${index * 25 + 20}px)`
      );

    legends
      .append('circle')
      .attr('r', 5)
      .style('fill', data => this.color(data));

    legends
      .append('text')
      .attr('dominant-baseline', 'central')
      .style('transform', 'translateX(10px)')
      .text(data => data);
  }

  // public updadteGraph(idOfSVG: string, newDatas: number[]) {
  //   const update = d3
  //     .select(`${idOfSVG}`)
  //     .selectAll('rect')
  //     .data(newDatas);
  //   this.drawAxises(update as any, newDatas);

  //   update
  //     .enter()
  //     .append('rect')
  //     .merge(update as any)
  //     .transition()
  //     .duration(this.transitionDuration)
  //     .attr('height', `${this.container.clientHeight + 5 - this.yScale(0)}px`)
  //     .style(`fill`, `${this.backgroundColor}`)
  //     .attr(`width`, this.xScale.bandwidth())
  //     .attr('x', (data, index) => this.xScale(`${index}`))
  //     .attr(`y`, this.yScale(0))
  //     .transition()
  //     .duration(this.transitionDuration)
  //     .attr('y', data => `${this.yScale(data)}`)
  //     .attr('height', data => `${this.container.clientHeight + 5 - this.yScale(data)}`)
  //     .delay((d, i) => i * 50);

  //   // If new datas have less elements, then remove it.
  //   update.exit().remove();
  // }

  createLegends(svg, datas: string[]) {
    // const newSvg = svg.select('g');
    d3.select('#svg')
      .append('g')
      .data(datas)
      .enter()
      .append('g')
      // .attr('', (data, index) => `translateY(${index + 20}px)`)
      .append('circle')
      .attr('cx', '50px')
      .attr('cy', '50px')
      .attr('r', '20px')
      .attr('fill', 'red');
  }

  private drawAxises(svg: d3.Selection<SVGGElement, {}, HTMLElement, any>, datas: IStackBarData[]) {
    const countries = datas.map((data, index) => data.country);

    // X Axis
    this.xScale.domain(countries);
    this.xAxis
      .transition()
      .duration(this.transitionDuration)
      .call(d3.axisBottom(this.xScale).tickSizeOuter(0));

    const keys = Object.keys(datas[0]).filter(key => key !== 'country');
    const totalPerCountry = keys.map(key =>
      datas.map(data => data[`${key}`]).reduce((current, previous) => current + previous)
    );
    // let totalsPerCountry = datas.map(data => data);
    // Y Axis
    this.yScale.domain([0, 60]);
    this.yAxis
      .transition()
      .duration(this.transitionDuration)
      .call(d3.axisLeft(this.yScale));
  }

  initializeXAxis(idOfContainer: string) {
    const svg = d3.select(`#${idOfContainer}`).append('g');
    this.xAxis = svg
      .append('g')
      .style(
        'transform',
        `translate(${this.spaceLeftForLeftAxis}px, ${this.container.clientHeight}px)`
      ) as d3.Selection<SVGGElement, {}, HTMLElement, any>;
  }

  initializeYAxis(idOfContainer: string) {
    const svg = d3.select(`#${idOfContainer}`).append('g');
    this.yAxis = svg
      .append('g')
      // tslint:disable-next-line: max-line-length
      .style('transform', `translate(${this.spaceLeftForLeftAxis}px, 0px)`) as d3.Selection<
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
    datas: IStackBarData[]
  ) {
    const groups = Object.keys(datas[0]).filter(name => name !== 'country');
    const stackedData = d3.stack().keys(groups)(datas as any);

    const bars = svg
      .selectAll('g.group')
      .data(stackedData)
      .enter()
      .append('g')
      .attr(`fill`, data => this.color(data.key) as string)
      .style(`transform`, `translateX(${this.spaceLeftForLeftAxis}px)`)
      .selectAll(`rect`)
      .data(data => data)
      .enter()
      .append(`rect`)

      .attr(`x`, data => this.xScale((data.data.country as any) as string))
      .attr(`class`, data => (data.data.country as any) as string)
      .attr('height', `${this.container.clientHeight - this.yScale(0)}px`)
      .attr('y', this.yScale(0))
      .attr(`width`, this.xScale.bandwidth());

    bars
      .transition()
      .duration(this.transitionDuration)
      .attr('y', data => `${yScale(data[1])}`)
      .attr('height', data => `${this.yScale(data[0]) - this.yScale(data[1])}px`)
      .delay((d, i) => i * 50);
    return bars;
  }

  private addToolTip(
    bars: d3.Selection<any, SeriesPoint<{ [key: string]: number }>, d3.BaseType, {}>
  ) {
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip');
    bars
      .on('mouseover', function(d) {
        d3.selectAll('rect').style(`opacity`, 0.5);
        d3.selectAll(`rect.${d.data.country}`).style('opacity', 1);

        const data = d3.select(this.parentNode).datum() as { data: any; key: string };
        const groupName = data.key; // Check wheter it is Male or Female.

        // Calculate Total Value
        const total = Object.keys(d.data)
          .filter(name => name !== 'country')
          .map(key => d.data[`${key}`])
          .reduce((previous, current) => previous + current);
        const percentage = ((d.data[`${groupName}`] / total) * 100).toFixed(1);

        d3.select(this)
          .transition()
          .duration(this.transitionDuration * 0.2);

        return tooltip
          .style('visibility', 'visible')
          .attr('data-html', 'true')
          .text(`${groupName}: ${d[1] - d[0]}(${percentage}%), Total: ${total} `);
      })
      .on('mousemove', () => {
        return tooltip
          .style('top', d3.event.pageY - 50 + 'px')
          .style('left', d3.event.pageX + 20 + 'px');
      })
      .on('mouseout', function() {
        d3.selectAll('rect').style(`opacity`, 1);
        d3.select(this)
          .transition()
          .duration(this.transitionDuration * 0.2)
          .style('opacity', 1);
        return tooltip.style('visibility', 'hidden');
      });
  }
}
