public with sharing class ContactController {


    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {

        //throw new AuraHandledException('Forced error');
        return [
            SELECT Id, FirstName, LastName, Email
            FROM Contact
            WITH SECURITY_ENFORCED
            ORDER BY FirstName
        ];
    }

    @AuraEnabled
    public static List<Contact> findContactsByAccountId(String accountId) {

        System.debug(accountId);
        List<Contact> listContacts = [SELECT Id, FirstName, LastName, AccountId,Email FROM Contact WHERE AccountId = :accountId];
        System.debug(listContacts);
        return listContacts;


    }
}