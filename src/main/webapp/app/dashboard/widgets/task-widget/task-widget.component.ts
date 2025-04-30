import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { TaskService } from 'app/entities/task/service/task.service';
import { ITask } from 'app/entities/task/task.model';
import dayjs from 'dayjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskModalComponent } from 'app/entities/task/modal/task-modal.component';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'jhi-task-widget',
  standalone: true,
  templateUrl: './task-widget.component.html',
  styleUrls: ['../../dashboard.component.scss'],
  imports: [CommonModule, SharedModule],
})
export class TaskWidgetComponent implements OnInit {
  tasks = signal<ITask[]>([]);
  today = dayjs().format('YYYY-MM-DD');
  newTaskTitle = '';

  protected modalService = inject(NgbModal);
  private readonly taskService = inject(TaskService);

  ngOnInit(): void {
    this.loadTodaysTasks();
  }

  loadTodaysTasks(): void {
    this.taskService.query().subscribe(res => {
      const tasksToday =
        res.body
          ?.filter(task => !task.parentTask && task.dueDate && dayjs(task.dueDate).isSame(this.today, 'day'))
          .sort((a, b) => Number(a.completed) - Number(b.completed)) ?? [];

      this.tasks.set(tasksToday);
    });
  }

  toggleCompleted(task: ITask): void {
    task.completed = !task.completed;
    this.taskService.update(task).subscribe(() => {
      this.loadTodaysTasks();
    });
  }

  addTask(title?: string): void {
    const taskTitle = title?.trim() ?? '';
    const modalRef = this.modalService.open(TaskModalComponent, { centered: true, size: 'lg', backdrop: 'static' });

    modalRef.componentInstance.task = {
      title: taskTitle,
      completed: false,
      priority: undefined,
      category: undefined,
      dueDate: undefined,
    };

    modalRef.closed.subscribe(result => {
      if (result) {
        this.newTaskTitle = '';
        this.loadTodaysTasks();
      }
    });
  }
}
