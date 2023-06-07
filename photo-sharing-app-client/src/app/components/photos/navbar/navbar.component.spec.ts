import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipService } from 'src/app/services/tooltip.service';
import { UserService } from 'src/app/services/user.service';
import { NavbarComponent } from './navbar.component';
import { ElementRef, EventEmitter } from '@angular/core';

fdescribe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockUserService: any;
  let mockTooltipService: any;
  let mockUserServiceSpy: any;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', [
      'getCurrentUser',
      'logout',
    ]);
    mockTooltipService = jasmine.createSpyObj('TooltipService', [
      'showTooltip',
      'hideTooltips',
    ]);

    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: TooltipService, useValue: mockTooltipService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;

    // Set initial values
    component.allPhotos = [
      { title: 'Photo1', description: 'Photo1 uploaded', checked: true },
      { title: 'Photo2', description: 'Photo2 uploaded', checked: true },
      { title: 'Photo3', description: 'Photo3 uploaded', checked: true },
    ];
    component.selectedPhotos = [];
    component.isSelectionEnabled = true;
    component.actionBtn = 'Select';
    component.deletePhotosEvent = new EventEmitter<string>();
    component.downloadPhotosEvent = new EventEmitter<string>();
    component.selectActionEvent = new EventEmitter<string>();

    const mockElementRef: ElementRef = {
      nativeElement: '',
    };
    component.logoutTooltipElement = mockElementRef;
    component.currentUserName = 'Test User';
    mockUserServiceSpy = mockUserService.getCurrentUser.and.returnValue({
      name: 'Test User',
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(mockUserServiceSpy).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });

  it('should call the showTooltip method of tooltip service', () => {
    const logoutTooltipElement: HTMLElement = document.createElement('div');
    const mocktooltipServiceLogoutSpy =
      mockTooltipService.showTooltip.and.returnValue(logoutTooltipElement);
    component.showTooltip(logoutTooltipElement);
    expect(mocktooltipServiceLogoutSpy).toHaveBeenCalledOnceWith(
      logoutTooltipElement
    );
  });

  it('should emit the selectActionEvent when selectActionClicked is called', () => {
    // Arrange
    let eventEmitted = false;
    component.selectActionEvent.subscribe(() => {
      eventEmitted = true;
    });

    // Act
    component.selectActionClicked();

    // Assert
    expect(eventEmitted).toBe(true);
  });

  it('should emit the deletePhotosEvent when user click on delete icon after selecting photos is called', () => {
    // Arrange
    let eventEmitted = false;
    component.deletePhotosEvent.subscribe(() => {
      eventEmitted = true;
    });

    // Act
    component.deletePhotos();

    // Assert
    expect(eventEmitted).toBe(true);
  });

  it('should emit the downloadPhotosEvent when user click on download icon after selecting photos is called', () => {
    // Arrange
    let eventEmitted = false;
    component.downloadPhotosEvent.subscribe(() => {
      eventEmitted = true;
    });

    // Act
    component.downloadPhotos();

    // Assert
    expect(eventEmitted).toBe(true);
  });

  it('should call the logout method of user service', () => {
    const mockUserServiceLogoutSpy = mockUserService.logout;
    component.logout();
    expect(mockUserServiceLogoutSpy).toHaveBeenCalled();
  });

});
