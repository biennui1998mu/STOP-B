import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../../interface/Project';

@Component({
  selector: 'app-project-menu',
  templateUrl: './project-menu.component.html',
  styleUrls: ['./project-menu.component.scss'],
})
export class ProjectMenuComponent implements OnInit {

  @Input()
  project: Project;

  expandState = false;

  constructor(
    // refer to this own element
    private element: ElementRef<HTMLElement>,
    private router: Router,
  ) {
  }

  get getProjectPersonalization() {
    return {
      background: this.project.colorCover ? this.project.colorCover : '#14579c',
      color: this.project.colorText ? this.project.colorText : '#ffffff',
    };
  }

  @Input()
  set defaultExpandState(isExpand: boolean) {
    this.clickExpand(isExpand, true);
  }

  get shortName() {
    const splitName = this.project.title.split(/[\s\-]/g);
    let firstChar: string;
    let secondChar: string;
    if (splitName.length > 1) {
      firstChar = splitName[0][0];
      secondChar = splitName[1][0];
    } else {
      firstChar = this.project.title[0];
      secondChar = this.project.title[1];
    }
    return (firstChar + secondChar).toUpperCase();
  }

  ngOnInit(): void {
  }

  clickExpand(stateTobe: boolean, init: boolean = false) {
    // expand the sub menu of this project
    this.expandState = stateTobe;
    const currentClasses = this.getClassesArray();
    if (this.expandState) {
      this.element.nativeElement.className = this.addNewCssClass(
        currentClasses,
        'active',
      );
      if (!init) {
        this.router.navigate(['project', 'view', this.project._id]);
      }
    } else {
      this.element.nativeElement.className = this.removeNewCssClass(
        currentClasses,
        'active',
      );
    }
  }

  private getClassesArray() {
    const cssClass = this.element.nativeElement.className;
    return cssClass.split(' ');
  }

  private addNewCssClass(
    currentClasses: string[],
    ...classes: string[]
  ) {
    const filterExistingClasses = currentClasses.filter(
      oldClass => classes.indexOf(oldClass) === -1,
    );
    filterExistingClasses.push(...classes);
    return filterExistingClasses.join(' ');
  }

  private removeNewCssClass(
    currentClasses: string[],
    ...classes: string[]
  ) {
    const filterExistingClasses = currentClasses.filter(
      oldClass => classes.indexOf(oldClass) === -1,
    );
    return filterExistingClasses.join(' ');
  }
}
