import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import * as keywords from "../../assets/files/topics.json";
import * as interests from "../../assets/files/interests.json";
import { Http } from "@angular/http";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  keywords: string[];
  interests: {}[] = [];
  selectedKeyword: string = "";
  results: {}[] = [];
  userInput: string = "";
  hasSelected: boolean = false;
  // for tags
  tagResults: {}[];
  tagSearchTerm: string = "";
  output: {}[] = [];
  tagsSelected: boolean = false;
  currentTags: {}[] = [];
  currentObject: {} = {
    keyword: "",
    tags: []
  };

  constructor(public navCtrl: NavController, private http: Http) {
    // assigning keywords JSON file to keywords array
    this.keywords = keywords["topics"];
    this.populateInterests();
    // this.populateOutput();
    // console.log(this.interests);
  }

  // when searching topics
  input(evt) {
    this.results = [];

    let query = new RegExp(this.userInput);
    for (let i = 0; i < this.keywords.length; i++) {
      if (
        this.keywords[i]
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .match(query)
      ) {
        this.results.push(this.keywords[i]);
      }
    }
  }

  onCancel(evt) {
    // this.results = [];
  }

  selectKeyword(kw) {
    this.selectedKeyword = kw;
    this.hasSelected = true;
    this.currentObject["keyword"] = kw;
  }

  // when searching interests

  tagSearch(input) {
    const term = new RegExp(this.tagSearchTerm);
    this.tagResults = [];

    for (let i = 0; i < this.interests.length; i++) {
      if (
        this.interests[i]["name"]
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .match(term)
      ) {
        this.tagResults.push(this.interests[i]);
      }
    }
  }

  selectTag(tag) {
    this.tagsSelected = true;
    // console.log(tag);
    this.currentObject["tags"].push(tag.id);
    this.currentTags.push(tag);
    console.log(this.currentObject);
    console.log(this.output);
  }

  removeTag(tag) {
    console.log(this.currentTags.indexOf(tag));
    this.currentTags.splice(this.currentTags.indexOf(tag), 1);
    this.currentObject["tags"].splice(
      this.currentObject["tags"].indexOf(tag.id),
      1
    );
    console.log(tag);
    console.log(this.currentTags);
    console.log(this.currentObject);
  }

  saveKeyword() {
    this.output.push(this.currentObject);
    this.currentTags = [];
    this.keywords.splice(
      this.keywords.indexOf(this.currentObject["keyword"]),
      1
    );
    this.currentObject = {
      keyword: "",
      tags: []
    };
    this.hasSelected = false;
    this.selectedKeyword = "";
    this.tagsSelected = false;
  }
  saveToFile() {
    const url =
      "https://frontiersmexico.glitch.me/downloadOutput/" +
      JSON.stringify(this.output, null, 4);
    window.open(url);
  }

  // init
  populateInterests() {
    // populating interests array from JSON tree
    for (let i = 0; i < 9; i++) {
      if (interests[i]["children"].length > 0) {
        for (let j = 0; j < interests[i]["children"].length; j++) {
          if (interests[i]["children"][j] != undefined) {
            const interest = {
              name: interests[i]["children"][j].name,
              hasId: interests[i]["children"][j].id == undefined ? false : true,
              id:
                interests[i]["children"][j].id == undefined
                  ? " "
                  : interests[i]["children"][j].id
            };
            if (interest.hasId) this.interests.push(interest);
            if (interests[i]["children"][j]["children"].length > 0) {
              for (
                let k = 0;
                k < interests[i]["children"][j]["children"].length;
                k++
              ) {
                const childrenInterest = {
                  name: interests[i]["children"][j]["children"][k].name,
                  id: interests[i]["children"][j]["children"][k].id,
                  hasId: true
                };
                this.interests.push(childrenInterest);
              }
            }
          }
        }
      }
    }
  }

  populateOutput() {
    for (let i = 0; i < this.interests.length; i++) {
      const obj = {
        keyword: this.keywords[i],
        tags: []
      };
      this.output.push(obj);
    }
  }
}
