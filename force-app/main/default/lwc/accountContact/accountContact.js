import { LightningElement, wire,track } from "lwc";

import findAccounts from '@salesforce/apex/AccountController.findAccounts';
import findContactsByAccountId from '@salesforce/apex/ContactController.findContactsByAccountId';

import { updateRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";



const columns = [
    { label: 'Account Name', fieldName: 'Name', type: 'text' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Website', fieldName: 'Website', type: 'url' },
    // Add more fields as needed
];

const contactColumns = [
    {
      label: "First Name",
      fieldName: "FirstName",
      editable: true,
    },
    {
      label: "Last Name",
      fieldName: "LastName",
      editable: true,
    },
    {
      label: "Email",
      fieldName: "Email",
      type: "email",
      editable: true,
    }
  ];

export default class AccountContact extends LightningElement {


    searchKey = '';
    accounts;
    
    columns = columns;
    wiredAccountsResult;


    contactColumns = contactColumns;
    draftValues = [];

    @track selectedAccountId
    selectAccount = [];    

    contacts = [];

    @wire(findAccounts, { searchKey: '$searchKey' })
    wiredAccounts(result) {
        
        this.wiredAccountsResult = result
        if (result.data) {
            this.accounts = result.data;

            console.log(result.data);
        } else if (result.error) {
            // Handle the error
            console.error('Error:', result.error);
        }
    }

    // @wire(findContactsByAccountId, { accountId: '$selectAccountId' })
    // wiredContacts(response) {
        
    //     this.contacts = response;
    // }


    handleSearchChange(event){
        this.searchKey = event.target.value;
    }


    handleRowSelection(event) {

        console.log(event.detail.selectedRows);
        this.selectAccount = event.detail.selectedRows;
        this.selectAccountId = event.detail.selectedRows[0].Id;

        this.fetchContacts()
        
    
    }

    async fetchContacts(){
        await findContactsByAccountId({ accountId: this.selectAccountId })
        .then(result => {
            this.contacts = result;
            console.log(result);
        })
        .catch(error => {
            console.error('Error fetching contacts:', error);
        });
    }

    async handleSave(event) {
        // TRANSFORM DATA MODIFIED BY THE USER
        const records = event.detail.draftValues.slice().map((draftValue) => {
            const fields = Object.assign({}, draftValue);
            return { fields };
        });

        try {
            // SAVE RECORDS USING updateRecord
            const recordUpdatePromises = records.map((record) => updateRecord(record));
            await Promise.all(recordUpdatePromises);
            setTimeout(() => this.fetchContacts(), 1000);

            
            this.showMessage("Success", "The Contacts has been updated!", "success");
            
        } catch (error) {
            this.showMessage("Error", error.body.message, "error");
        } finally{
            this.draftValues = [];
        }
    }

    // SHOW MESSAGE
    showMessage(title, message, variant){
        this.dispatchEvent(
            new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            }),
        );
    }

  

}