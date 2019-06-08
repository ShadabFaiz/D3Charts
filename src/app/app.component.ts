import { Component, AfterViewInit, NgZone } from '@angular/core';
import { GraphGenerator } from './Graphs/Graphs';
import { HorizontalBarChart } from './Graphs/HorizontalBarChart';
import { VerticalBarChart } from './Graphs/VerticalBarChart';
import { StackedBarChart } from './Graphs/StackedBarChart';
import { IStackBarData } from './models/IStackBarData';

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
    const chart = new StackedBarChart(this.dataForStackBarChart, 'svg');
    chart.draw(this.dataForStackBarChart, `svg`);
    // setTimeout(() => {
    //   chart.updadteGraph(`svg`, [1, 4, 13, 4, 16, .5, 2, 55]);
    // }, 2000);
  }
}
