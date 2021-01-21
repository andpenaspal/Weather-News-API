import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the GetWeatherProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GetWeatherProvider {
  //Instantiate HTTPClient
  constructor(public http: HttpClient) {
  }

  //Method to access the Weather API
  getWeather(city: string, units: string): Observable<any>{
    //Key: e41f650f8b3ed7647a0c338bb92e5742
    //Example full url: http://api.openweathermap.org/data/2.5/weather?q=galway&units=metric&appid=e41f650f8b3ed7647a0c338bb92e5742

    //Get the JSON and return it
    return this.http.get("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + units + "&appid=e41f650f8b3ed7647a0c338bb92e5742");
  }

}
