global class RealOnlyApex {

    @RemoteAction
    @readOnly
    global static list<Custom_Object__c> getAllRecords(){
        
        return [SELECT Id, Name, Name__c, createdDate, sample_date__c FROM Custom_Object__c ];
    }
    
    
    
    @RemoteAction
    @readOnly
    global static list<Custom_Object__c> getRecords(Integer offSet){
        
        return [SELECT Sequence__c,Name, Name__c, Sample__c, CreatedDate  FROM Custom_Object__c WHERE (Sample__c = 'Changed Data' AND Sequence__c >: offSet) ORDER BY Sequence__c ASC NULLS LAST LIMIT 10000];
    }
    
    
    @AuraEnabled
    public static List<Custom_Object__c> getRecs(Integer offSet){
        
        return [SELECT Sequence__c,Name, Name__c, Sample__c, Sample_Date__c,CreatedDate  FROM Custom_Object__c WHERE (Sequence__c >: offSet) ORDER BY Sequence__c ASC NULLS LAST LIMIT 10000];
    }
}