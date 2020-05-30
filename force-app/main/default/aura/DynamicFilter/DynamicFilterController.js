({
    handleChange : function(component, event, helper) {
        console.log("In handlechange");
        component.set("v.fieldName", event.getParam("value"));
        
        var fieldOptions = component.get("v.options");
        
        const selectedType = fieldOptions.find(element => element.value === event.getParam("value"));
        
        component.set("v.selectedType", selectedType.type);
        
        console.log("selectedType", selectedType.type);
        
        var textFilter = [
            {'label': '==', 'value': '=='},
            {'label': '!=', 'value': '!='},
            {'label': 'contains', 'value': 'includes'}
        ];
        var dateFilter = [
            {'label': '==', 'value': '=='},
            {'label': '!=', 'value': '!='},
            {'label': '>', 'value': '>'},
            {'label': '<', 'value': '<'},
            {'label': '<=', 'value': '<='},
            {'label': '>=', 'value': '>='}
        ];
        console.log("In handlechange 6"); 
        if(selectedType.type == 'text') {
            component.set("v.filters",textFilter);
        }
        else if(selectedType.type == 'date' || selectedType.type == 'datetime') {
            component.set("v.filters",dateFilter);
        }
    },
    
    handleFilterChange: function(component, event, helper) {
        component.set("v.selectedFilter", event.getParam("value"));
    },
    
    init : function(component, event, helper) {
        console.log("In Init");
        
        
        
        var fieldOptions = component.get("v.options");
        /*var fieldOptions = [
            { label: 'Number', fieldName: 'Name', type: 'text' },
            { label: 'Name', fieldName: 'Name__c', type: 'text' },
            { label: 'Sample', fieldName: 'Sample__c', type: 'text' },
            { label: 'Created Date', fieldName: 'CreatedDate', type: 'date' }
        ];*/
        var tempOptions = [... fieldOptions];
        console.log("fieldOptions", fieldOptions);
        var options = tempOptions.map( ele => {
            return { "label": ele.label, "value":ele.fieldName, "type": ele.type, "fieldApi": ele.fieldName};
                                      });
        console.log("options", options);
        component.set("v.options", options);
        
        var filters = [
            {'label': '==', 'value': '=='},
            {'label': '!=', 'value': '!='},
            {'label': '>', 'value': '>'},
            {'label': '<', 'value': '<'},
            {'label': '<=', 'value': '<='},
            {'label': '>=', 'value': '>='},
            {'label': 'contains', 'value': 'includes'}
        ];
        component.set("v.filters",filters);
        
    },
    
    search : function(component, event, helper) {
        if(component.get("v.disabled"))
            return;
        
        helper.validateSearch(component, event, helper);
    },
    
    reset : function(component, event, helper) {
        if(component.get("v.disabled"))
            return;
        
        var compEvent = component.getEvent("sendFilteredData");
        compEvent.setParams({ reset: true });
        compEvent.fire();
    },
})