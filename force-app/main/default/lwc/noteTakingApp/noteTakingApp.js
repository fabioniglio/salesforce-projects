import { LightningElement, wire } from "lwc";

import createNoteRecord from "@salesforce/apex/NoteTakingController.createNoteRecord";
import getNotes from "@salesforce/apex/NoteTakingController.getNotes";

const DEFAULT_NOTE_FORM = {
  Name: "",
  Note_Description__c: ""
};

export default class NoteTakingApp extends LightningElement {
  showModal = false;

  noteRecord = DEFAULT_NOTE_FORM;
  noteList = [];

  formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "indent",
    "align",
    "link",
    "clean",
    "table",
    "header",
    "color"
  ];

  get isFormInvalid() {
    return !(
      this.noteRecord &&
      this.noteRecord.Note_Description__c &&
      this.noteRecord.Name
    );
  }

  @wire(getNotes)
  noteListInfo({ data, error }) {
    if (data) {
      console.log("Data of notes", JSON.stringify(data));
      this.noteList = data.map((item) => {
        let formatedDate = new Date(item.LastModifiedDate).toDateString();
        return { ...item, formatedDate };
      });
    }
    if (error) {
      console.log("Get an error in fetching", error);
      this.showToastMsg(error, "error");
    }
  }

  createNoteHandler() {
    this.showModal = true;
  }

  closeModalHandler() {
    this.showModal = false;

    this.noteRecord = DEFAULT_NOTE_FORM;
  }

  changeHandler(event) {
    const { name, value } = event.target;

    this.noteRecord = { ...this.noteRecord, [name]: value };
  }

  formSubmitHandler(event) {
    event.preventDefault();
    console.log("this.noteRecord", JSON.stringify(this.noteRecord));

    this.createNote();
  }

  createNote() {
    createNoteRecord({
      title: this.noteRecord.Name,
      description: this.noteRecord.Note_Description__c
    })
      .then(() => {
        this.showModal = false;
        // You might want to reset the form or display a success message here.
        this.noteRecord = { ...DEFAULT_NOTE_FORM }; // Resetting the form to default.
        this.showToastMsg("Note Created Successfully!!!", "success");
      })
      .catch((error) => {
        // Improved error handling
        let message = "Unknown error"; // Default error message
        if (Array.isArray(error.body)) {
          // If the error is an array (bulk errors), join all messages.
          message = error.body.map((e) => e.message).join(", ");
        } else if (error.body && typeof error.body.message === "string") {
          // If the error is a single object with a message.
          message = error.body.message;
        }
        console.error("Error creating note:", message);
        this.showToastMsg(message, "error");
        // Here you can handle the error, like showing an error message to the user
      });
  }

  showToastMsg(message, variant) {
    const elem = this.template.querySelector("c-notification");
    if (elem) {
      elem.showToast(message, variant);
    }
  }
}