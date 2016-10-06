import { Component, ViewChild, Input, OnInit, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import {
    GridComponent,
    GridDataResult,
    DataStateChangeEvent,
    toODataString,
    State,
    PageChangeEvent
 } from '@progress/kendo-angular-grid';


@Injectable()
export class OrderService extends BehaviorSubject<GridDataResult> {
    private BASE_URL: string ='http://localhost:3000/api/orders'; 
    
    constructor(private http: Http) {
        super(null);
    }

    public query(state): void {
        this.fetch(state)
            .subscribe(x => super.next(x));
    }

    private fetch(state: State): Observable<GridDataResult> {
        const queryStr = `${toODataString(state)}`;
        return this.http
            .get(`${this.BASE_URL}?${queryStr}`)
            .map(response => response.json())
            .map(response => (<GridDataResult>{
                data: response,
                total: 50000
            }));
    }
}
@Component({
  providers: [OrderService],
  selector: 'my-app',
  template: `
      <kendo-grid
          [data]="view | async"
          [pageSize]="pageSize"
          [scrollable]="'virtual'"
          [rowHeight]="36"
          [height]="600"
          (pageChange)="pageChange($event)"
        >
        
        <kendo-grid-column field="search_order_id" title="Search Orer ID" width="200"></kendo-grid-column>
        <kendo-grid-column field="customer_order_id" title="Customer Order ID" width="200"></kendo-grid-column>
        <kendo-grid-column field="order_status.order_status_desc" title="Order Status" width="200"></kendo-grid-column>
        <kendo-grid-column field="customer_information.company_name" title="Company Name" width="200"></kendo-grid-column>
        <kendo-grid-column field="customer_information.contact_name" title="Contact" width="200"></kendo-grid-column>
        <kendo-grid-column field="order_information.product_desc" title="Product" width="200"></kendo-grid-column>
        <kendo-grid-column field="report_information.report_status_desc" title="Report Status" width="200"></kendo-grid-column>
        <kendo-grid-column field="trademark.search_description" title="Search Description" width="200"></kendo-grid-column>
        <kendo-grid-column field="user_information.user_name" title="User Assigned" width="200"></kendo-grid-column>
      </kendo-grid>
  `
})

export class AppComponent {
    private view: Observable<GridDataResult>;
    private pageSize: number = 500;
    private skip: number  = 0;

    @ViewChild(GridComponent) private grid: GridComponent;
    constructor(private service: OrderService) {
        this.view = service;
        this.service.query({ skip: this.skip, take: this.pageSize });
    }

    public ngAfterViewInit(): void {
        this.grid.dataStateChange
            .do(({ skip, take }: DataStateChangeEvent) => {
                this.skip = skip;
                this.pageSize = take;
            })
            .subscribe(x => this.service.query(x));

        /*this.grid.pageChange
            .do((event: PageChangeEvent) => {
                this.skip = event.skip;
            })
            .subscribe(x => this.service.query(x));*/
    }

    protected pageChange(event: PageChangeEvent): void {
        console.log(event);
        this.skip = event.skip;
        this.service.query({ skip: this.skip, take: this.pageSize });
    }
}




/*import { Component } from '@angular/core';
import {
    GridDataResult,
    PageChangeEvent
 } from '@progress/kendo-angular-grid';

@Component({
  selector: 'my-app',
  template: `
         <kendo-grid
          [data]="gridView"
          [pageSize]="pageSize"
          [scrollable]="'virtual'"
          [rowHeight]="36"
          [height]="690"
          (pageChange)="pageChange($event)"
        >
        <kendo-grid-column field="id" [width]="50" title="ID"></kendo-grid-column>
        <kendo-grid-column field="firstName" title="First Name" [width]="120"></kendo-grid-column>
        <kendo-grid-column field="lastName" title="Last Name" [width]="120"></kendo-grid-column>
        <kendo-grid-column field="city" title="City" [width]="120"></kendo-grid-column>
        <kendo-grid-column field="title" title="Title" [width]="120"></kendo-grid-column>
      </kendo-grid>
    ` 
})
export class AppComponent {
  private gridView: GridDataResult;
    private data: any[];
    private pageSize: number = 1000;
    private skip: number = 0;

    constructor() {
        this.data = this.createRandomData(100000);
        this.loadProducts();
    }

    protected pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.loadProducts();
    }

    private loadProducts(): void {
        this.gridView = {
            data: this.data.slice(this.skip, this.skip + this.pageSize),
            total: this.data.length
        };
    }

    private createRandomData(count: number) {
        const firstNames = ["Nancy", "Andrew", "Janet", "Margaret", "Steven", "Michael", "Robert", "Laura", "Anne", "Nige"],
            lastNames = ["Davolio", "Fuller", "Leverling", "Peacock", "Buchanan", "Suyama", "King", "Callahan", "Dodsworth", "White"],
            cities = ["Seattle", "Tacoma", "Kirkland", "Redmond", "London", "Philadelphia", "New York", "Seattle", "London", "Boston"],
            titles = ["Accountant", "Vice President, Sales", "Sales Representative", "Technical Support", "Sales Manager", "Web Designer",
            "Software Developer", "Inside Sales Coordinator", "Chief Technical Officer", "Chief Execute Officer"];

        return Array(count).fill({}).map((_, idx) => ({
                id: idx + 1,
                firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
                lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
                city: cities[Math.floor(Math.random() * cities.length)],
                title: titles[Math.floor(Math.random() * titles.length)]
            })
        );
    }
}
*/