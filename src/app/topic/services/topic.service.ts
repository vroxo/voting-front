import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";

export type VoteProperties = {
  session_id: string;
  yes?: boolean;
  no?: boolean;
}

export type TopicProperties = {
  title: string,
  description: string
}

@Injectable()
export class TopicService {
  constructor(private http: HttpClient) { }

  getTopics(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/topics`);
  }

  createTopic({ title, description }: TopicProperties): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/topics`, { title, description });
  }

  getOpenSession(topicId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/topics/${topicId}/open-session`);
  }

  sendVote({ session_id, yes, no }: VoteProperties): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/votes`, { session_id, yes, no });
  }

  createSession(topicId: string, duration: number): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/sessions`, { topic_id: topicId, duration });
  }

  getTopicResults(topicId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/topics/${topicId}/results`);
  }
}
