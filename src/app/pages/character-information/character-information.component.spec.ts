import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterInformationComponent } from '@src/app/pages/character-information/character-information.component';

describe('CharacterInformationComponent', () => {
  let component: CharacterInformationComponent;
  let fixture: ComponentFixture<CharacterInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
