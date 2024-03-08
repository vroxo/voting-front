import { Component, OnInit, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TopicService } from '../services/topic.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HttpStatusCode } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';


@Component({
  selector: 'app-topic-list',
  templateUrl: './list-topics.component.html',
  styleUrl: './list-topics.component.scss',
  standalone: false,
})
export class TopicListComponent implements OnInit {
  constructor(
    private topicService: TopicService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  @ViewChild('modalVotes')
  modalVotes!: TemplateRef<any>;
  @ViewChild('newSession')
  newSession!: TemplateRef<any>;
  @ViewChild('newUser')
  newUser!: TemplateRef<any>;
  @ViewChild('topicResults')
  topicResults!: TemplateRef<any>;

  newTopicForm!: FormGroup;
  newSessionForm!: FormGroup;
  newUserForm!: FormGroup;

  closeResult = '';
  activeTopic: any;
  activeTopicResults: any;

  topics: any[] = []
  user: any = null;
  session: any = null;

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    this.initialize();
  }

  private initialize() {
    this.newTopicForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });

    this.newUserForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      passwordConfirm: ['', [Validators.required]],
    });

    this.newSessionForm = this.formBuilder.group({
      duration: ['', Validators.required],
    });

    this.topicService.getTopics().subscribe({
      next: (topics) => {
        this.topics = topics;
      },
      error: ({ error }) => {
        this.showErrorMessage(error.message);
      }
    });
  }

  openTopic(active: any) {
    this.activeTopic = active;
    this.topicService.getOpenSession(this.activeTopic.id).subscribe({
      next: (session) => {
        this.session = session;
      },
      error: ({ error }) => {
        this.showErrorMessage(error.message);
        if (error.statusCode === HttpStatusCode.NotFound) {
          this.openNewSession();
        }
      },
      complete: () => {
        this.openNewVote();
      }
    });

    console.log('Properties state', {active, session: this.session});

  }

  private openNewVote() {
    this.modalService.open(this.modalVotes, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
      (result) => {
        switch (result) {
          case 'S':
            this.topicService.sendVote({ session_id: this.session.id, yes: true }).subscribe({
              next: () => {
                this.showMessage('Vote sent.');
              },
              error: ({ error }) => {
                this.showErrorMessage(error.message);
              },
              complete: () => {
                this.session = null;
              }
            });
            break;
          case 'N':
            this.topicService.sendVote({ session_id: this.session.id, no: true }).subscribe({
              next: () => {
                this.showMessage('Vote sent.');
              },
              error: ({ error }) => {
                this.showErrorMessage(error.message);
              },
              complete: () => {
                this.session = null;
              }
            });
            break;
          default:
            break;
        }
      }
    );
  }

  private openNewSession() {
    this.modalService.open(this.newSession, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
      (result) => {
        if (result === 'SEND') {
          this.topicService.createSession(this.activeTopic.id, this.newSessionForm.get('duration')?.value).subscribe({
            next: () => {
              this.showMessage('New session created.');
            },
            error: ({ error }) => {
              this.showErrorMessage(`Error: ${error.message}`);
            },
            complete: () => {
              this.openTopic(this.activeTopic);
              this.newSessionForm.reset();
            }
          });
        }
      }
    );
  }

  openNewTopic(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
      (result) => {
        switch (result) {
          case 'C':
            this.newTopicForm.reset();
            break;
          case 'SEND':
            this.sendNewTopic()
            break;
          default:
            break;
        }
      },
    );
  }

  openNewUser(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
      (result) => {
        switch (result) {
          case 'C':
            this.newTopicForm.reset();
            break;
          case 'SEND':
            this.sendNewUser()
            break;
          default:
            break;
        }
      },
    );
  }

  sendNewTopic() {
    let title = this.newTopicForm.get('title')?.value;
    let description = this.newTopicForm.get('description')?.value;

    this.topicService.createTopic({ title, description }).subscribe({
      next: () => {
        this.showMessage('New topic created.');
        this.modalService.dismissAll();
        this.initialize();
      },
      error: ({ error }) => {
        this.showErrorMessage(error.message);
      },
    });
  }

  sendNewUser() {
    let name = this.newUserForm.get('name')?.value;
    let cpf = this.newUserForm.get('cpf')?.value;
    let username = this.newUserForm.get('username')?.value;
    let password = this.newUserForm.get('password')?.value;
    let passwordConfirm = this.newUserForm.get('passwordConfirm')?.value;

    if (password !== passwordConfirm) {
      this.showErrorMessage('Passwords do not match.');
      return;
    }

    this.authService.createUser({ name, cpf, credentials: { username, password } }).subscribe({
      next: () => {
        this.showMessage('New user created.');
        this.modalService.dismissAll();
      },
      error: ({ error }) => {
        this.showErrorMessage(error.message);
        this.newUserForm.reset();
      },
      complete: () => {
        this.newUserForm.reset();
      },
    });
  }

  openTopicResults(topic: any) {
    this.topicService.getTopicResults(topic.id).subscribe({
      next: (results) => {
        this.activeTopicResults = results;
        console.log('Topic results', this.activeTopicResults);
      },
      error: ({ error }) => {
        this.showErrorMessage(error.message);
      },
      complete: () => {
        this.modalService.open(this.topicResults, { ariaLabelledBy: 'modal-basic-title', size: 'lg' })
      }
    });
  }

  showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
    });
  }

  showErrorMessage(message: string) {
    this.snackBar.open(`Error: ${message}`, 'Close', {
      duration: 5000,
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
