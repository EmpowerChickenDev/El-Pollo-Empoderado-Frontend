import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, RouterTestingModule],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    // `title` is a signal on the component; assert its value directly.
    // Access via a typed cast through `unknown` to avoid using `any`.
    const appWithTitle = app as unknown as { title: () => string };
    const titleValue = appWithTitle.title();
    expect(titleValue).toBe('frontend');
  });
});
