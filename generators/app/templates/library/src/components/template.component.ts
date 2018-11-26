import { Component, OnInit } from '@angular/core';

@Component({
  selector: "<%= componentName %>",
  templateUrl: "./<%= componentName %>.component.html",
  styleUrls: ["./<%= componentName %>.component.scss"]
})
export class <%= componentClassName %> implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
