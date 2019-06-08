import { BaseChart } from './BaseChart';
import * as d3 from 'd3';

export class PieChart extends BaseChart {
    initializeXAxis(...args: any[]) {
        throw new Error("Method not implemented.");
    }
    initializeYAxis(...args: any[]) {
        throw new Error("Method not implemented.");
    }
    protected xScale: any;


    public draw(datas: any[], container: SVGElement) {
        const radius = (Math.min(container.clientHeight, container.clientWidth) / 2) - 5 ;
        const svg = d3.select(`#svg`);
        const grouped = svg.append('g').attr('transform', `translate(${radius + 5}, ${radius + 5})`);
        const color =  d3.scaleOrdinal((d3.schemeCategory10));
        const pie = d3.pie().value((data: any) => data.percentage);
        const path = d3.arc().outerRadius(radius).innerRadius( .5 * radius );
        const arc = grouped.selectAll('arc').data(pie(datas)).enter().append('g');
        arc.append('path').attr('d', path as any).attr('fill', (d: any) => color(d.data.percentage));
       }
}