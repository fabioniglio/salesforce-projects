public with sharing class NoteTakingController {
  @AuraEnabled
  public static Boolean createNoteRecord(String title, string description) {
    try {
      if (!String.isBlank(title)) {
        My_Note__c noteRec = new My_Note__c(
          Name = title,
          Note_Description__c = description
        );
        insert noteRec;
        return true;
      }
      return false;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<My_Note__c> getNotes() {
    try {
      return [
        SELECT Id, Name, Note_Description__c, LastModifiedDate
        FROM My_Note__c
        ORDER BY LastModifiedDate DESC
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
