import { Component, AfterViewInit } from '@angular/core';
import { IStackBarData } from './models/IStackBarData';
import * as d3 from 'd3';
import { ScatterPlot } from './Graphs/ScatterPlot/ScatterPlot';
import { IScatterPlotData } from './models/IScatterPlotData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'D3Implmentation';
  data = [15, 4, 3, 14, 16, 17, 22, 25, 15];

  dataForStackBarChart: IStackBarData[] = [
    {
      country: 'India',
      Men: 44,
      Women: 11,
      child: 1,
    },
    {
      country: 'US',
      Men: 12,
      Women: 5,
      child: 22,
    },
    {
      country: 'UK',
      Men: 12,
      Women: 19,
      child: 15,
    },
  ];
  dataForPie = [
    { os: 'android', percentage: 30 },
    { os: 'ios', percentage: 20 },
    { os: 'windos', percentage: 48 },
    { os: 'linux', percentage: 2 },
  ];

  ngAfterViewInit() {
    // const chart = new StackedBarChart(this.dataForStackBarChart, 'svg');
    // chart.draw(this.dataForStackBarChart, `svg`);
    // // setTimeout(() => {
    // //   chart.updadteGraph(`svg`, [1, 4, 13, 4, 16, .5, 2, 55]);
    // // }, 2000);

    this.drawScatterPlot();
  }

  drawScatterPlot() {
    d3.csv(
      'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv'
    ).then(datas => {
      const graph = new ScatterPlot('svg');
      // console.log(datas[datas.length - 1]);
      graph.draw((datas as any) as IScatterPlotData[], 'svg');
    });
  }
}
