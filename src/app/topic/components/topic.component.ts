import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-topic-component',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
  standalone: false,
})
export class TopicComponent implements OnInit {
  id: string | null = null;



  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    console.log('TopicComponent initialized');
    this.id = this.route.snapshot.paramMap.get('id');
  }
}
