import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarkdownService } from '../../../services/markdown.service';

@Component({
  selector: 'app-task-comment-input',
  templateUrl: './task-comment-input.component.html',
  styleUrls: ['./task-comment-input.component.scss'],
})
export class TaskCommentInputComponent implements OnInit {

  @ViewChild('textAreaElement')
  textAreaElement: ElementRef<HTMLTextAreaElement>;

  formInput: FormGroup;

  previewMarkdown: string;
  isPreview: boolean = false;
  minHeightPreview: number;

  constructor(
    private fb: FormBuilder,
    private markdown: MarkdownService,
  ) {
    this.formInput = this.fb.group({
      content: ['', [Validators.required]],
      images: [null],
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
