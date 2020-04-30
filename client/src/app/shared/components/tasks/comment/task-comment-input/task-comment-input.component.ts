import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarkdownService } from '../../../../services/markdown.service';
import { Task } from '../../../../interface/Task';
import { Project } from '../../../../interface/Project';
import { User } from '../../../../interface/User';
import { TokenService } from '../../../../services/token.service';

@Component({
  selector: 'app-task-comment-input',
  templateUrl: './task-comment-input.component.html',
  styleUrls: ['../../styles/task-comment.scss'],
})
export class TaskCommentInputComponent implements OnInit {
  @Input()
  task: Task<User, Project>;

  @Input()
  project: Project<User>;

  @ViewChild('textAreaElement')
  textAreaElement: ElementRef<HTMLTextAreaElement>;

  userId = this.tokenService.user?._id;

  formInput: FormGroup;

  previewMarkdown: string;
  isPreview: boolean = false;
  minHeightPreview: number;

  constructor(
    private fb: FormBuilder,
    private markdown: MarkdownService,
    private tokenService: TokenService,
  ) {
    this.formInput = this.fb.group({
      content: ['', [Validators.required]],
      images: [null, [Validators.maxLength(10)]],
      tasks: [null],
    });
  }

  get content() {
    return this.formInput.get('content');
  }

  get images() {
    return this.formInput.get('images');
  }

  get tasks() {
    return this.formInput.get('tasks');
  }

  ngOnInit(): void {
  }

  preview() {
    const getCurrentHeight = this.textAreaElement.nativeElement.offsetHeight;
    this.isPreview = !this.isPreview;
    if (this.isPreview && this.content.valid) {
      this.minHeightPreview = getCurrentHeight;
      this.previewMarkdown = this.markdown.toMarkdown(
        this.content.value,
      );
    } else {
      this.minHeightPreview = null;
      this.previewMarkdown = null;
    }
  }
}
