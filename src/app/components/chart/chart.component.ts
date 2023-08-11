import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, filter, take } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ISprint } from 'src/app/shared/interfaces/project';
import { IStore } from 'src/app/shared/interfaces/store';
import { setChartAction } from 'src/app/store/projects/projects.actions';
import { sprintSelector } from 'src/app/store/projects/sprint/sprint.selectors';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy {

  public sizes: { height: number, width: number } = {
    height: 600,
    width: 1200
  };
  public containerHeight: string = 'auto';
  private sprint!: ISprint;
  private months: string[] = [];
  private chart: Chart  | null = null;
  private chartLables!: {[key: string]: string};

  constructor (
    private store: Store<IStore>,
    private router: Router,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    const urlArr = this.router.url.split('/').reverse();
    const projectId = urlArr[3];
    const sprintId = urlArr[1];
    combineLatest(
      this.store.select(sprintSelector(projectId, sprintId)), 
      this.translateService.get(['LABELS.MONTHS', 'CHART'])
      )   
      .pipe(filter(([sprint]) => !!sprint), take(1))
      .subscribe(([sprint, language]) => {
        this.sprint = sprint as ISprint;
        this.months = language?.['LABELS.MONTHS'];
        this.chartLables = language?.['CHART'];
        this.initChart();
      })
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  public closeChart(): void {
    this.store.dispatch(setChartAction({ chartOpen: false }));
  }

  private initChart(): void {
    Chart.register(...registerables);
    Chart.defaults.color = 'black';
    Chart.defaults.borderColor = 'black';
    Chart.defaults.font.family = 'Montserrat, sans-serif'
    
    const { scheduledData, actualData, labels } = this.getDataForChart();
    this.setChartSize(labels.length);
    this.chart = new Chart('chart', this.getSettingsForChart(scheduledData, actualData, labels));
  }

  // Sets size of chart container, based on amount of dates(labels for bottom scale)
  private setChartSize(value: number): void {
    if (value * 80 < 650) {
      this.sizes.width = 650;
    } else if (value * 80 > 1200) {
      this.sizes.width = 1200;
    } else {
      this.sizes.width = value * 80;
    }

    this.sizes.height = this.sizes.width / 2;
  }

  // Gets labels, scheduled time left data and actual time left data
  private getDataForChart(): { scheduledData: number[], actualData: number[], labels: string[] } {
    const scheduledData: number[] = [];
    const labelDates: string[] = [];
    const storageDates: string[] = []

    let tempDate = new Date(this.sprint.startDate);
    while (tempDate.getTime() < new Date(this.sprint.endDate).getTime()) {
      storageDates.push(this.getFormattedDate(tempDate, 'storage'));
      labelDates.push(this.getFormattedDate(tempDate, 'label'));
      tempDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() + 1);
    }

    const diff = Number((this.sprint.duration / labelDates.length).toFixed(3));
    for (let i = 0; i < labelDates.length; i++) {
      if (i + 1 === labelDates.length) {
        scheduledData.push(0);
        break;
      };

      scheduledData.push(Number((this.sprint.duration - diff * (i + 1)).toFixed(2)));
    }

    return {
      scheduledData,
      actualData: this.getActualSpentsData(storageDates),
      labels: labelDates
    }
  }

  // Gets actual time left data
  private getActualSpentsData(dates: string[]): any[] {
    const actualData = [];
    const hoursSpentArr = [];
    for (let i = 0; i < dates.length; i++) {
      const hoursSpent = this.sprint.tasks.reduce((accum, value) => {
        const hours = value.spentHoursDay.find(({ date }) => date === dates[i])?.hours || 0;
        return accum += hours;
      }, 0);
      hoursSpentArr.push(hoursSpent);
    }

    if (hoursSpentArr.every((value) => value === 0)) return [this.sprint.duration];

    for (let i = 0; i < dates.length; i++) {
      if (!i) {
        actualData.push(Number((this.sprint.duration - hoursSpentArr[i]).toFixed(3)));
        continue;
      }

      actualData.push(Number((actualData[i-1] - hoursSpentArr[i]).toFixed(3)));
    }

    let indexOfLastChanges = 0;
    for (let i = 1; i < actualData.length; i++) {
      if (actualData[i - 1] === actualData[i]) continue;
      indexOfLastChanges = i;
    }

    return actualData.slice(0, indexOfLastChanges + 1);
  }

  // Gets formatted date. Format 'label' for chart labels, 'storage' - to get hours spent in certain date
  private getFormattedDate(date: Date, format: 'label' | 'storage'): string {
    if (format === 'storage') {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    } else {
      return `${date.getDate()} ${this.months[date.getMonth()].slice(0, 3)}`;
    }
  }

  // Gets formatter function for chart to filter which labels to show
  private getFormatterForDataset(): (value: any, context: any) => number | string {
    return (value, context) => {
      if (context.datasetIndex !== 1) return value;

      if (context.dataIndex === 0) return value;
      
      const arr = context.dataset.data;
      if (arr[context.dataIndex - 1] === arr[context.dataIndex]) {
        return '';
      }
    }
  }

  // Gets settings and data for chart
  private getSettingsForChart(scheduledData: number[], actualData: number[], labels: string[] ): any {
    const options = {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          border: {
            width: 1,
          },
          grid: {
            display: false
          },
        },
        y: {
          border: {
            display: false
          },
          grid: {
            drawTicks: false,
            lineWidth: 0.2
          },
          ticks: {
            padding: 10
          },
          max: this.sprint.duration + 20 - this.sprint.duration%10
        }
      },
      plugins: {
        title: {
          display: true,
          text: this.chartLables?.['TITLE'],
          position: 'top',
          align: 'start',
          font: {
            size: 18
          }
        },
        subtitle: {
          display: true,
          text: this.chartLables?.['SUBTITLE'],
          position: 'left'
        },
        legend: {
          labels: {
            usePointStyle: true,
            pointStyle: 'circle'
          },
          onHover: ((evt: any) => { (evt.native?.target as HTMLElement).style.cursor = 'pointer'; }),
          onLeave: ((evt: any) => { (evt.native?.target as HTMLElement).style.cursor = 'default'; })
        },
        datalabels: {
          borderRadius: 5,
          backgroundColor: '#fff',
          padding: {
            bottom: -2,
            right: 0,
            top: 0,
            left: 1
          },
          formatter: this.getFormatterForDataset()
        }
      },
      datasets: {
        line: {
          pointRadius: 2,
          tension: 0.3
        },
      }
    };

    const data = {
      labels,
      datasets: [{
        label: this.chartLables?.['SCHEDULED_TIME'],
        data: scheduledData,
        datalabels: {
          color: '#FA3B3F',
          align: 'top'
        },
        borderWidth: 1,
        borderColor: '#FA3B3F',
        backgroundColor: '#FA3B3F'
      },
      {
        label: this.chartLables?.['ACTUAL_TIME'],
        data: actualData,
        datalabels: {
          color: '#1988ee',
          align: 'top'
        },
        borderWidth: 1,
        borderColor: '#1988ee',
        backgroundColor: '#1988ee'  
      }]
    }

    return {
      type: 'line',
      data,
      options,
      plugins: [ChartDataLabels]
    }
  }

}
