
List<Id> serviceTargetIds = new List<Id> {'a6Y0f000000Xdw7EAC','a6Y0f000000XdwDEAS','a6Y0f000000XdwEEAS','a6Y0f000000Xdw2EAC','a6Y0f000000XdwmEAC','a6Y0f000000XdwnEAC','a6Y0f000000XdwhEAC','a6Y0f000000XdwiEAC','a6Y0f000000XdwwEAC',
'a6Y0f000000XdwxEAC',
'a6Y0f000000XdwXEAS',
'a6Y0f000000XdwYEAS',
'a6Y0f000000XdwSEAS',
'a6Y0f000000XdwTEAS',
'a6Y0f000000Xdx1EAC',
'a6Y0f000000Xdx2EAC',
'a6Y0f000000XdwrEAC',
'a6Y0f000000XdwsEAC',
'a6Y0f000000XdwNEAS',
'a6Y0f000000XdwOEAS',
'a6Y0f000000XdwIEAS',
'a6Y0f000000XdwJEAS',
'a6Y0f000000XdwcEAC',
'a6Y0f000000XdwdEAC',
'a6YG0000000TXdcMAG',
'a6YG0000000TXdmMAG',
'a6YG0000000TXdhMAG',
'a6YG0000000TXdrMAG'};
List<BMCServiceDesk__Service_Target__c> updatedServiceTargets = new List<BMCServiceDesk__Service_Target__c>();
List<BMCServiceDesk__Service_Target_Criteria__c> updatedServiceTargetCriteria = new List<BMCServiceDesk__Service_Target_Criteria__c>();

List<BMCServiceDesk__Service_Target__c> serviceTargetList = [Select Id,Name,BMCServiceDesk__Postfix_Start_Clock_Advanced_Expression__c from BMCServiceDesk__Service_Target__c where Id in :serviceTargetIds];
for(BMCServiceDesk__Service_Target__c st : serviceTargetList){
    //st.BMCServiceDesk__Postfix_Start_Clock_Advanced_Expression__c=st.BMCServiceDesk__Postfix_Start_Clock_Advanced_Expression__c.replace('ПASSIGNEDП','ПUNASSIGNEDП');
    st.BMCServiceDesk__Postfix_Start_Clock_Advanced_Expression__c='fkstatus__r.nameП=ПUNASSIGNEDПreference¬fkstatus__r.nameП=ПIN PROGRESSПreference¬fkstatus__r.nameП=ПROOT CAUSE DETERMINEDПreference¬fkstatus__r.nameП=ПSOLUTION IDENTIFIEDПreference¬fkstatus__r.nameП=ПIMPACT MITIGATEDПreference¬fkstatus__r.nameП=ПCUSTOMER RESPONDEDПreference¬fkstatus__r.nameП=ПASSIGNEDПreference¬OR¬OR¬OR¬OR¬OR¬OR';
    updatedServiceTargets.add(st);
}

/*
List<BMCServiceDesk__Service_Target_Criteria__c> serviceTargetCriteriaList = [Select Id,Name,BMCServiceDesk__Field_Info__c,BMCServiceDesk__Operator__c,BMCServiceDesk__Operand__c from BMCServiceDesk__Service_Target_Criteria__c where BMCServiceDesk__FKService_Target__c in :serviceTargetIds and BMCServiceDesk__Field_Info__c = 'fkStatus__c' and BMCServiceDesk__Operator__c = '=' and BMCServiceDesk__Operand__c = 'ASSIGNED' and BMCServiceDesk__ST_Criteria_Type__c = 1];
for(BMCServiceDesk__Service_Target_Criteria__c stc : serviceTargetCriteriaList){
	stc.BMCServiceDesk__Operand__c = 'UNASSIGNED';
	updatedServiceTargetCriteria.add(stc);
}
*/

List<BMCServiceDesk__Service_Target_Criteria__c> serviceTargetCriteriaList = [Select Id,Name,BMCServiceDesk__Field_Info__c,BMCServiceDesk__Operator__c,BMCServiceDesk__Operand__c from BMCServiceDesk__Service_Target_Criteria__c where BMCServiceDesk__FKService_Target__c in :serviceTargetIds and BMCServiceDesk__ST_Criteria_Type__c = 1];
for(BMCServiceDesk__Service_Target_Criteria__c stc : serviceTargetCriteriaList){
	stc.BMCServiceDesk__Grouping_Operator__c = 0;
	updatedServiceTargetCriteria.add(stc);
}
//For QA use ASSIGNED. For Prod use UNASSIGNED
for(BMCServiceDesk__Service_Target__c st : serviceTargetList){
	BMCServiceDesk__Service_Target_Criteria__c stc = new BMCServiceDesk__Service_Target_Criteria__c();
	stc.BMCServiceDesk__Field_Info__c = 'fkStatus__c';
	stc.BMCServiceDesk__Operator__c = '='; 
	stc.BMCServiceDesk__Operand__c = 'ASSIGNED';
	stc.BMCServiceDesk__ST_Criteria_Type__c = 1;
	stc.BMCServiceDesk__Order_Index__c = 7;
	stc.BMCServiceDesk__FKService_Target__c = st.Id;
	updatedServiceTargetCriteria.add(stc);
}

update updatedServiceTargets;
upsert updatedServiceTargetCriteria;
