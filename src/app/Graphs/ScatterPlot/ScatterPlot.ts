import { BaseChart } from '../BaseChart';
import * as d3 from 'd3';
import { IStackBarData } from '../../models/IStackBarData';
import { SeriesPoint } from 'd3';
import { IScatterPlotData } from 'src/app/models/IScatterPlotData';

export class ScatterPlot extends BaseChart {
  protected yScale: d3.ScaleLinear<number, number>;
  protected xScale: d3.ScaleLinear<number, number>;

  protected yAxis: any;
  protected xAxis: any;

  protected readonly marginBetweenBars = 10;

  protected spaceLeftForLeftAxis = 120;
  protected spaceLeftonTop = 40;

  protected spaceLeftOnBottomAxix = 35;

  protected color;

  constructor(idOfSVG: string) {
    super(idOfSVG);
    this.initializeScales(this.container);
    this.initializeXAxis(idOfSVG);
    this.initializeYAxis(idOfSVG);
    this.initializeColor();
  }

  initializeColor() {
    this.color = d3.scaleOrdinal().range(d3.schemeSet2);
  }

  public draw(datas: IScatterPlotData[], idOfContainer: string) {
    // Group all the elements and appends new group for each dataset.
    const svg = d3.select(`#${idOfContainer}`);

    this.drawAxisLabels(svg);

    this.drawAxises(svg, datas);

    const plots = this.creatPlots(svg, datas);

    // // Add labels on hover.
    this.addToolTip(plots);
  }

  drawAxisLabels(svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>) {
    // X Axis Label
    svg
      .append('text')
      .attr('class', 'xAxisLabel')
      .attr('text-anchor', 'middle')
      .attr('y', `${this.container.clientHeight - this.spaceLeftOnBottomAxix + 50}`)
      .style('transform', `translateX(50%)`)
      .style('font-size', `1.5em`)
      .text('Grid Area');

    // Y Axis Label
    svg
      .append('text')
      .attr('class', 'yAxisLabel')
      .attr('transform', 'rotate(-90)')
      .attr('y', `${this.spaceLeftonTop}`)
      .attr('x', `-${this.container.clientHeight / 2 + 50}`)
      .style('font-size', `1.5em`)
      .text('Sale Price');
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

  private drawAxises(svg: any, datas: IScatterPlotData[]) {
    const SalePrice = datas.map((data, index) => data.SalePrice);
    const HouseArea = datas.map((data, index) => data.GrLivArea);

    // X Axis
    this.xScale.domain([0, d3.max(HouseArea) * 8]);

    this.xAxis
      .transition()
      .duration(this.transitionDuration)
      .call(d3.axisBottom(this.xScale).tickSizeOuter(0));

    // Y Axis
    this.yScale.domain([0, d3.max(SalePrice) * 8]);
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
        `translate(${this.spaceLeftForLeftAxis}px, ${this.container.clientHeight -
          this.spaceLeftOnBottomAxix}px)`
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
      lowerLimit: parent.clientHeight - this.spaceLeftOnBottomAxix,
    });
    this.xScale = d3.scaleLinear().range([0, parent.clientWidth - this.spaceLeftForLeftAxis]);
  }

  private creatPlots(
    svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
    datas: IScatterPlotData[]
  ) {
    const newSVG = svg
      .append('g')
      .attr('transform', `translate(${this.spaceLeftForLeftAxis}, 0)`)
      .selectAll('dots')
      .data(datas)
      .enter()
      .append('circle')
      .attr('cx', data => this.xScale(0))
      .attr('cy', data => this.yScale(0))
      .attr('r', 3)
      .attr('fill', data => this.color(data.SalePrice))
      .attr('opacity', 1);

    newSVG
      .transition()
      .duration(this.transitionDuration)
      .delay((data, index) => index * 1)
      .attr('cx', data => this.xScale(data.GrLivArea))
      .attr('cy', data => this.yScale(data.SalePrice));

    return newSVG;
  }

  private addToolTip(bars: d3.Selection<SVGCircleElement, IScatterPlotData, SVGGElement, {}>) {
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip');
    bars
      .on('mouseover', function(d) {
        return tooltip
          .style('visibility', 'visible')
          .attr('data-html', 'true')
          .text(`GridArea: ${d.GrLivArea} sq(m),    SalePrice: ${d.SalePrice}  `);
      })
      .on('mousemove', () => {
        return tooltip
          .style('top', d3.event.pageY - 50 + 'px')
          .style('left', d3.event.pageX + 20 + 'px');
      })
      .on('mouseout', function() {
        return tooltip.style('visibility', 'hidden');
      });
  }
}
