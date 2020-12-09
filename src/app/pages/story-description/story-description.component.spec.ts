import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryDescriptionComponent } from '@src/app/pages/story-description/story-description.component';

describe('StoryDescriptionComponent', () => {
  let component: StoryDescriptionComponent;
  let fixture: ComponentFixture<StoryDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
