import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettPage } from '../../pages/sett/sett';
import { GetWeatherProvider } from '../../providers/get-weather/get-weather';
import { GetNewsProvider } from '../../providers/get-news/get-news';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //General Display Variables
    //Initial Message to display if no data
  private initialMessage: string;
    //Hidden/Not if there is/isn't data
  private initialMessageHidden: boolean = false;
    //Weather container to display if data
  private weatherContainerHidden: boolean = true;
    //General Error Flag to control Async calls after error catch
      //eg: if News in first city and Second City "Error Catch City not found", getNews() would re-enable News button after disabled on handleGeneralDisplay()
  private errorFound: boolean = false;

  //Weather Variables
    //Array of objects containing relevant information
  private locationsArray: Array<object> = [];
    //String with the correspondent symbol from the Units selected
  private weatherSymbol: string;

  //Variables for the News (some as class variables just to access them from the HTML)
    //Accessibility to "News" Button
  private newsDisabled = true;
    //Country of the News to display
  private newsCountry: string = "";
    //Array with the different News Articles
  private news: Array<object> = [];
    //Flag to display the news or not on click on button "News"
  private hideNews: boolean = true;
    //Number of Total Pages
  private numberOfPages: number;
    //Number of total Articles
  private numberOfArticles: number;
    //Array with the specific set of news to show in the correspondent page displayed
  private newsToShow: Array<object> = [];
    //Number of Articles per page
  private articlesPerPage: number = 5;
    //List with the total number of pages
  private pages: Array<number> = [];
    //Variable to store the first new of the correspondent page
  private firstNew: number;
    //Variable to store the last new of the correspondent page
  private lastNew: number;
    //Flag to disable "Previous Page" Button when on first page
  private disablePreviousButton: boolean = true;
    //Flag to disable "Next Page" Button when on last page
  private disableNextButton: boolean = false;
    //Variable to store the current page shown
  private currentPageNews: number;

  //Constructor: instantiate Classes needed to allow Dependency Injection
  constructor(public navCtrl: NavController, private gw: GetWeatherProvider, private gn: GetNewsProvider, private st: Storage) {
  }

  //On first load, show nothing deleting any stored value on Storage
  ionViewDidLoad(){
    this.st.clear();
  }

  /* Method to Push the Settings Page */
  goSettings(){
    this.navCtrl.push(SettPage);
  }

  //On Change get the Weather Data
  ionViewDidEnter(){
    //Reset basic variables
    this.locationsArray = [];
    this.errorFound = false;
    //Wait until the storage is ready
    this.st.ready()
      .then(() => {
        //Get the data
        this.st.get('dataStorage')
          //On success Accessing the Storage
          .then((data) => {
            //If there's data (not first load)
            if(data){
              //Get to the API with the info in Storage
                //Send news info too: Information from Weather (Country) needed to access the news. Get the news from the Weather Async call
              this.getWeather(data.loc, data.unit, data.news);
              //Check if there is a Second City and get its data if necessary
              if(data.comp){
                this.getWeather(data.loc2, data.unit, data.news);
              }
              //Get the Symbol of the Temperature with the units required
              this.weatherSymbol = this.getWeatherSymbol(data.unit);
              //Display the Weather Container and Hide the General Initial Message
              this.handleGeneralDisplay(true);
            //If no data, Display General Initial Message (Successfully access data but not data stored)
            }else{
              this.handleGeneralDisplay(false, "Please Select City(ies) in Settings");
            }
          })
          //Catch Errors on Accessing Storage
          .catch((err) => {
            //Display General Information Message
            this.handleGeneralDisplay(false, "Error trying to access storage");
            //Show error on Console
            console.log("Error trying to access storage: ")
            console.log(err);
          });
      })
      //Catch Errors on Checking if Storage Ready
      .catch((err) => {
        this.handleGeneralDisplay(false, "Error trying to check Storage readiness");
        console.log("Error trying to check Storage readiness: ")
        console.log(err);
      })
    //All above went fine...
      //On new view of page:
        //Data accessed, weather and news got successfully
    //Always hide news when showing weather for new city
      //(Note: not display (click to show), not disabled)
    this.hideNews = true;
  }

  //Method to handle the General Display (Message optional: Only if message to be shown)
    //Show Weather if operation successfully completed
    //Show General Message on Error message
  handleGeneralDisplay(weather: boolean, message?: string){
    if(weather){
      this.initialMessageHidden = true;
      this.weatherContainerHidden = false;
      //No message, info
      //News made clickable in getNews() if all successful
    }else{
      this.initialMessageHidden = false;
      this.weatherContainerHidden = true;
      this.initialMessage = message;
      this.newsDisabled = true;
      this.errorFound = true;
    }
  }

  //Method to access the weather API (provider) and populate the variables
    //Also call the method to get the news (variable from Weather needed)
  getWeather(location: string, unit: string, news: string){
    this.gw.getWeather(location, unit).subscribe(
      //On success Accessing the API
      (dataWeather) => {
        //Custom Object type to store the information needed
        let data: object = {
          location: dataWeather.name,
          weather: dataWeather.weather[0].main,
          description: dataWeather.weather[0].description,
          temperature: dataWeather.main.temp,
          feels: dataWeather.main.feels_like,
          icon: this.getWeatherIcon(dataWeather.weather[0].icon),
          country: dataWeather.sys.country,
          news: undefined,
        };
        //Push the Object into the array storing the Weather(s)
          //Possible future enhancement: Sorting. City1 always first, City2 always second.
            //Being Async operations it could get randomly sorted. Not big deal though
        this.locationsArray.push(data);

        //Check if the Location is linked with the News request
          //Possible future enhancement: Store News for both cities/Countries. Option in Settings to get news for both and both buttons displayed on toggle with each other
            //Problems: 
              //Weather Display needs to be sorted to show news related to country column related
                //News display should be in the same order as the Weather Display
            //First thoughts: Play with Maps? --> Research about *ngFor with key-values
        if(location == news){
          //Store the Country (HTML)
          this.newsCountry = dataWeather.sys.country;
          //Get the news for the chosen Location
          this.getNews(dataWeather.sys.country);
        }
      },
      //On Error Accessing the API
      (err) => {
        //Show General Message with the Problem
        this.handleGeneralDisplay(false, "Error Accessing Weather Information: \"" + location + ": " + err.error.message + "\"");
        //Show full error on Console for Dev purposes
        console.log("Error Accessing Weather Information: ")
        console.log(err);
        //Delete Storage to avoid hypothetical problems
        this.st.clear();
      }
    );
  }

  //Method to format the Weather IMG
  getWeatherIcon(icon: string): string{
    return "http://openweathermap.org/img/w/" + icon + ".png";
  }

  //Method to select the correct Unit Symbol for Display
  getWeatherSymbol(unit: string): string{
    switch (unit) {
      //Celsius Symbol: &#8451;
      case "metric":
        return "&#8451;";
      //Kelvin Symbol: &#8490;
      case "standard":
        return "&#8490;";
      //Farenheit Symbol: &#8457;
      case "imperial":
        return "&#8457;";
      default:
        return "";
    }
  }
  
  //Method to get the news from the API (Provider)
  getNews(newsCountry: string){
      this.gn.getNews(newsCountry).subscribe(
        //If successfully accessed to API
        dataNews => {
          //Store the articles
          this.news = dataNews.articles;
          //Store the total number of articles
          this.numberOfArticles = dataNews.totalResults;
          //Reset News variables
          this.resetNewsVariables();
          //Process data related to the News
          this.setNumberOfPages();
          //Set first page as the one to be shown by default
          this.setNewsToShow(1);
          //Allow News button to be clicked
          this.newsDisabled = false;
          //Check flag in case there was an error in previously resolved Async call
          if(this.errorFound) this.newsDisabled = true;
        },
        //If error Accessing the news
        (err) => {
          //Only show in console as there's little the user can do
          console.log("Error trying to access the news: ")
          console.log(err);
          //Button will not be enabled as it is from the success block
        }
      );
  }

  //Method to toggle News Button to display or not the news 
  showNews(){
    //Toggle to show/not show the news
    this.hideNews = !this.hideNews;
  }

  //Method to calculate and set the number of pages
  setNumberOfPages(){
    //Give only the integer
    this.numberOfPages = Math.floor(this.numberOfArticles / this.articlesPerPage);
    //Add +1 page if not exact division
    if((this.numberOfArticles % this.articlesPerPage) > 0) this.numberOfPages++;
    //Store in array the set of pages (possible modification of page display, check setNewsToShow() comments)
    for(let i: number = 1; i <= this.numberOfPages; i++){
      this.pages.push(i);
    }
  }

  //Set the set of news to show
    //Calculate the set to show and push them into the array for display
    //Possible Modification:
      //If Array of clickable numbers wanted instead of "Previous" "Next" Buttons:
        //Set the numbers to this method with its value as parameter
        //Array of available pages from setNumberOfPages() Method
  setNewsToShow(page: number){
    this.lastNew = page * this.articlesPerPage;
    //Calculate the exact number of articles in last page if not same as default, Error otherwise trying to push not defined object from the Articles Array
      //eg: 38 articles, 5 articles per page -> last page with 3 articles. If trying to populate the default 5 per page error as there are not enough articles, only 3
    if(this.lastNew > this.numberOfArticles) this.lastNew = this.numberOfArticles;
    //Calculate first new of the page
    this.firstNew = (page * this.articlesPerPage) - this.articlesPerPage;
    //Reset Array of Articles to Display
    this.newsToShow = [];
    //Push selected Articles from all Articles Array by their index
      //NOTE: Do not mess with index 0/1 -> "firstNew +1" in HTML to correct display of index
    for(let i: number = this.firstNew; i < this.lastNew; i++){
      this.newsToShow.push(this.news[i]);
    }
  }

  //Method to reset News Variables
  resetNewsVariables(){
    this.pages = [];
    this.newsToShow = [];
    this.currentPageNews = 1;
    this.disablePreviousButton = true;
  }

  //Method to handle "previous page" button
  previousPageNews(){
    this.currentPageNews--;
    //Disable Button if in the first page
    if(this.currentPageNews == 1) this.disablePreviousButton = true;
    //Enable Button if not first page
      //Some error in some situations. Better be sure
    if(this.currentPageNews < this.numberOfPages) this.disableNextButton = false;
    //Set new set of articles to show
    this.setNewsToShow(this.currentPageNews);
  }

  //Method to handle "next page" button
  nextPageNews(){
    this.currentPageNews++;
    //If "Next Page" clicked, can not be First page. Enable "Previous Page" Button
    this.disablePreviousButton = false;
    //If in next page, disable "Next Page" Button
    if(this.currentPageNews == this.numberOfPages) this.disableNextButton = true;
    //Set new set of articles to show
    this.setNewsToShow(this.currentPageNews);
  }
}



