import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the GetNewsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GetNewsProvider {

  constructor(public http: HttpClient) {
  }

  //Method to access the API
  getNews(country: string): Observable<any>{
    //Key: 1da39bd474bb4ef2b961d9b617ff36f8
    //Example of full URL: "https://newsapi.org/v2/top-headlines?country=ie&pageSize=5&apiKey=1da39bd474bb4ef2b961d9b617ff36f8

    //Return the JSON
      //Country from parameter
      //Page size to 100 -> Allow the maximum, handle it on Pages on home.ts
    return this.http.get("https://newsapi.org/v2/top-headlines?country=" + country + "&pageSize=100&apiKey=1da39bd474bb4ef2b961d9b617ff36f8");
  }

}
