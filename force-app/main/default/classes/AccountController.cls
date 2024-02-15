public with sharing class AccountController {


    @AuraEnabled(cacheable=true)
    public static List<Account> findAccounts(String searchKey) {
        String key = '%' + searchKey + '%';
        
        List<Account> listAccountQuery = [SELECT Id, Name, Phone, Website FROM Account WHERE Name LIKE :key ORDER BY Name Desc Limit 200];

        System.debug(listAccountQuery);
       
        return listAccountQuery;
    }


    @AuraEnabled
    public static List<Contact> findContactsByAccountId(String accountId) {

        System.debug(accountId);
        List<Contact> listContacts = [SELECT Id, FirstName, LastName, AccountId,Email FROM Contact WHERE AccountId = :accountId];
        System.debug(listContacts);
        return listContacts;


    }


 
}