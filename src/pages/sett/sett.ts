import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the SettPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sett',
  templateUrl: 'sett.html',
})
export class SettPage {
  //Object to store Weather values from the form
  sett = {
    location: undefined,
    location2: undefined,
    unit: undefined,
    //If Toggle for Second City was activated
    statusToggle: undefined,
  };

  //Variables to control and store the news Option
    //Toggle Radio Buttons programmatically
  news1handler: boolean;
  news2handler: boolean;
    //Store which location is selected for the news
  news: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private st: Storage) {
  }

  //Everytime the page is loaded
    //Attribute "checked" in HTML file with ion-radio button does not work. Set Metric as default value here
      //Do it on "enter" to let the user see the default value visually in the radio button as checked from default
  ionViewDidEnter(){
    this.sett.unit = "metric";
    //Set status toggle to have a default false
      //Otherwise just not stored in the object if not checked and we need to know if there's a second city on Home)
    this.sett.statusToggle = false;
    //Set by default news on first city (if SecondCity Toggle was activated or not)
      //Option of news only shown on Active Toggle
    this.news1handler = true;
      //Second city news false by default. Initialization of the Toggle behaviour 
    this.news2handler = false;
    this.news = "";
  }

  //Method to store the info in the Storage and pop the page on "submit" button (Save)
  setSettings(sett){
    //Set Galway as default if nothing selected but "Saved"
    if(sett.location == undefined) sett.location = "Galway";
    //Set toggle to false if true but not second city selected
    if(sett.statusToggle == true && sett.location2 == undefined) sett.statusToggle = false;
    //Check which radio button was checked and assign the correspondent location
    if(this.news1handler){
      this.news = this.sett.location;
    }else{
      this.news = this.sett.location2;
    }

    //If Toggle false, set news to First city and delete any Second city hypothetically inserted
    if(!sett.statusToggle){
      this.news = this.sett.location;
      this.sett.location2 = undefined;
    } 
    //If Second city empty, set news automatically to the first location (Galway by default or selected on form)
    if(sett.location2 == undefined) this.news = this.sett.location;
    
    //Store all data from the object of the form
    this.st.set('dataStorage', {"loc": sett.location, "unit": sett.unit, "comp": sett.statusToggle, "loc2": sett.location2, "news": this.news});
    //Close the page and go back to Home
    this.navCtrl.pop();
  }

  //Toggle radio buttons for "news" option
  handleNewsOption(){
    this.news1handler = !this.news1handler;
    this.news2handler = !this.news2handler;
  }

}
