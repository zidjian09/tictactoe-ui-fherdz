import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  readonly APIUrl = "https://localhost:44310/api";

  constructor(private http: HttpClient) { }

  testConnection() {
    const body = [
      { "player": "X" },
      { "player": "" },
      { "player": "" },
      { "player": "" },
      { "player": "" },
      { "player": "" },
      { "player": "" },
      { "player": "" },
      { "player": "" }
    ];

    return this.http.post(this.APIUrl + "/game", body);
  }

  play(body: any) {
    return this.http.post(this.APIUrl + "/game", body);
  }
}
