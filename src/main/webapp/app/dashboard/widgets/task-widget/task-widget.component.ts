import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { TaskService } from 'app/entities/task/service/task.service';
import { ITask } from 'app/entities/task/task.model';
import dayjs from 'dayjs';

@Component({
  selector: 'jhi-task-widget',
  standalone: true,
  templateUrl: './task-widget.component.html',
  styleUrls: ['../../dashboard.component.scss'],
  imports: [CommonModule],
})
export class TaskWidgetComponent {
  tasks = signal<ITask[]>([]);
  today = dayjs().format('YYYY-MM-DD');

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
}
