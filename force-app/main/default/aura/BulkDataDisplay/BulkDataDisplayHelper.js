({
    auraAction : function(component, helper, offSet, totalRecords) {
        console.log("In auraAction Method");
        
        var action = component.get("c.getRecs");
        action.setParams({
            offSet : offSet
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log("State", state);
            if(state === 'SUCCESS') {
                var result = response.getReturnValue();
                if(result && result.length > 0) {
                    
                    var records = result;
                    helper.paginateData(component, helper, records);
                    
                    //console.log('existingRecords: '+component.get("v.receivedRecords").length);
                    var existingRecsLength = component.get("v.receivedRecords").length;
                    
                    if(existingRecsLength < totalRecords) {
                        helper.auraAction(component, helper, result[result.length - 1].Sequence__c, totalRecords);
                    }
                    else {
                        component.set("v.queryCompleted", true);
                    }
                    component.set("v.totalQueryRowsReturned", component.get("v.receivedRecords").length);
                }
                
            }
            else {
                console.log("Error In auraAction");
            }
        });
        
        $A.enqueueAction(action);
    },
    
    paginateData : function(component, helper, records) {
        
        var receivedRecords = component.get("v.receivedRecords");
        var rowsToLoad = component.get("v.rowsToLoad");
        
        if(receivedRecords) {
            component.set("v.receivedRecords", receivedRecords.concat(records));
            component.set("v.copyOfData", JSON.stringify(receivedRecords.concat(records)));
        }
        else {
            component.set("v.receivedRecords", records);
            component.set("v.copyOfData", JSON.stringify(records));
            component.set("v.paginatedList", records.slice(0,rowsToLoad));
            component.set("v.hasReceivedData", true);
            component.set("v.totalNumberOfRows", records.slice(0,rowsToLoad).length);
        }
        //component.set("v.copyOfData", component.get("v.receivedRecords"));
        
    },
    
    paginateFilteredData : function(component, helper, records) {
        
        
        //var receivedRecords = component.get("v.receivedRecords");
        var rowsToLoad = component.get("v.rowsToLoad");
        
        component.set("v.receivedRecords", records);
        component.set("v.paginatedList", records.slice(0,rowsToLoad));
        component.set("v.hasReceivedData", true);
        component.set("v.totalNumberOfRows", records.slice(0,rowsToLoad).length);
        
        
    },
    
    sortData: function (component, fieldName, sortDirection) {
        var data = component.get("v.paginatedList");
        var reverse = sortDirection !== 'asc';
        //sorts the rows based on the column header that's clicked
        data.sort(this.sortBy(fieldName, reverse))
        component.set("v.paginatedList", data);
        //helper.paginateFilteredData(component, helper, data);
    },
    sortBy: function (field, reverse, primer) {
        var key = primer ?
            function(x) {return primer(x[field])} :
        function(x) {return x[field]};
        //checks if the two rows should switch places
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    },
    
})