import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandScroller } from './brand-scroller';

describe('BrandScroller', () => {
  let component: BrandScroller;
  let fixture: ComponentFixture<BrandScroller>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandScroller]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandScroller);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
