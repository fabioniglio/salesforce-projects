public without sharing class NoteTakingController {
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

  @AuraEnabled
  public static Boolean updateNoteRecord(
    String noteId,
    String title,
    String description
  ) {
    try {
      if (!String.isBlank(noteId)) {
        My_Note__c note = [
          SELECT Id, Name, Note_Description__c, LastModifiedDate
          FROM My_Note__c
          WHERE Id = :noteId
          LIMIT 1
        ];
        note.Name = title;
        note.Note_Description__c = Description;

        Database.update(note);
      }
      return false;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static Boolean deleteNoteRecord(String noteId) {
    try {
      if (!String.isBlank(noteId)) {
        My_Note__c noteRec = new My_Note__c(Id = noteId);
        Database.delete(noteRec);
        return true;
      }
      return false;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
