import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { <%= componentClassName %> } from "./<%= componentName %>.component";

describe("<%= componentClassName %>", () => {
  let component: <%= componentClassName %>;
  let fixture: ComponentFixture<<%= componentClassName %>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ <%= componentClassName %> ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(<%= componentClassName %>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
