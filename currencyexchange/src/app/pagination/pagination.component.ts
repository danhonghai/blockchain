import {Component, EventEmitter, Input, OnInit, Output,OnChanges,SimpleChanges,DoCheck} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit,OnChanges,DoCheck {

  page;
  @Input()
  option
  @Output()
  pageChange: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.optionInit();
  }

  ngOnChanges(changes: SimpleChanges):void{
    //console.log(JSON.stringify(changes, null, 2));
  }

  ngDoCheck(): void {//子组件里的变更检测，
    this.page = this.getRange(this.option.index, this.option.all, this.option.count);
  }

  //数据初始化处理
  optionInit(){
    //容错处理
    if (!this.option.index || isNaN(this.option.index) || this.option.index < 1) this.option.index = 0;
    if (!this.option.all || isNaN(this.option.all) || this.option.all < 1) this.option.all = 0;
    if (this.option.index > this.option.all) this.option.index = this.option.all;
    if (!this.option.count || isNaN(this.option.count) || this.option.count < 1) this.option.count = 1;
    if (!this.option.total || isNaN(this.option.total) || this.option.total < 1) this.option.total = 10;
    //得到显示页数的数组
    this.page = this.getRange(this.option.index, this.option.all, this.option.count);
  }

  //返回页数范围（用来遍历）
  getRange(curr, all, count) {
      //计算显示的页数
      curr = parseInt(curr);
      all = parseInt(all);
      count = parseInt(count);
      let from = curr - Math.ceil(count/2);
      let to = curr + Math.ceil(count / 2) + (count % 2) - 1;
      //显示的页数容处理
      if (from <= 0) {
          from = 1;
          to = from + count - 1;
          if (to > all) {
              to = all;
          }
      }
      if (to > all) {
          to = all;
          from = to - count + 1;
          if (from <= 0) {
              from = 1;
          }
      }
      let range = [];
      for (let i = from; i <= to; i++) {
          range.push(i);
      }
      range.push('下一页');
      range.unshift('上一页');
      return range;
  }

  pageClick(page:any){
    if (page == '上一页') {
      page = parseInt(this.option.index) - 1;
    } else if (page == '下一页') {
      page = parseInt(this.option.index) + 1;
    }
    if (page < 1){
      page = 1;
    }else if (page > this.option.all){
      page = this.option.all;
    }
    //点击相同的页数 不执行点击事件
    if (page == this.option.index){
      return false;
    }
    this.pageChange.emit(page);
    /*if (this.option.click && typeof $scope.option.click === 'function') {
        $scope.option.click(page);
        $scope.option.curr = page;
        $scope.page = getRange($scope.option.curr, $scope.option.all, $scope.option.count);
    }*/
  }

}
