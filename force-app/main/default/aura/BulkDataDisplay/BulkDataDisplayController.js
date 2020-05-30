({
    init : function(component, event, helper) {
        var columnData = [
            { label: 'Number', fieldName: 'Name', sortable: true, type: 'text' },
            { label: 'Name', fieldName: 'Name__c', sortable: true, type: 'text' },
            { label: 'Sample', fieldName: 'Sample__c', sortable: true, type: 'text' },
            { label: 'Sample Date', fieldName: 'Sample_Date__c', sortable: true, type: 'date' },
            { label: 'Created Date', fieldName: 'CreatedDate', sortable: true, type: 'date', typeAttributes: {  
                day: 'numeric',  
                month: 'short',  
                year: 'numeric',  
                hour: '2-digit',  
                minute: '2-digit',  
                second: '2-digit',  
                hour12: true} }
        ];
        component.set('v.columns', columnData);
        component.set('v.columnCopy', [...columnData]);
        component.set("v.loadChild", true);
        
        if(component.get("v.loadDataFromLightning")) {
            helper.auraAction(component, helper, 0, component.get("v.totalRowsToQuery"));
        }
        
    },
    
    messageReceived: function(component, message, helper) { 
        //While using VF remoting, get data using LMS
        
        if (message != null && message.getParam("messageToSend") != null) {
            var records = JSON.parse(message.getParam("messageToSend"));                        
            helper.paginateData(component, helper, records);
        }
        //console.log('receivedRecords length...',component.get("v.receivedRecords").length);
    },
    
    loadMoreData : function(component, event, helper) { 
        //console.log("In LoadMoreDate");
        //debugger;

        var rawDataRows = component.get("v.receivedRecords"); // All records
        var rowsToLoad = component.get("v.rowsToLoad"); //Page Size
        var loadedDataRows = component.get("v.paginatedList"); //Already Loaded Rows
        var totalNumberOfRows = component.get("v.totalNumberOfRows"); //count of loaded rows
        
        if(rawDataRows && totalNumberOfRows < rawDataRows.length) {
            component.set("v.onLoadMoreStatus", '');
            
            event.getSource().set("v.isLoading", true);
            
            var newDataRows = rawDataRows.slice(totalNumberOfRows,totalNumberOfRows + rowsToLoad); //New Data Rows
            
            var finalDataRows = loadedDataRows.concat(newDataRows);
            //console.log("finalDataRows", finalDataRows);
            console.log("finalDataRows Size", finalDataRows.length);
            
            component.set("v.paginatedList", finalDataRows);
            component.set("v.totalNumberOfRows", finalDataRows.length);
            
            event.getSource().set("v.isLoading", false);
        }
        else {
            component.set("v.onLoadMoreStatus", 'There are no more rows to load');
            component.set("v.enableInfiniteLoading", false);
            return;
        }
    },
    
    handleSendFilteredDataEvent : function(component, event, helper) {
        component.set("v.enableInfiniteLoading", false);
        var search = event.getParam("search");
        var reset = event.getParam("reset");
        var triggered = event.getParam("triggered");
        var filteredData;
        
        //console.log('eventData', `search:${search} || reset: ${reset} || triggered: ${triggered}`);
        
        
        if(search) {
            filteredData = event.getParam("varEventFilteredData");
            helper.paginateFilteredData(component, helper, JSON.parse(filteredData));
            component.set("v.noOfFilteredRows", JSON.parse(filteredData).length);
        }
        else
            if(reset) {
                helper.paginateFilteredData(component, helper, JSON.parse(component.get("v.copyOfData")));
                component.set("v.noOfFilteredRows", '');
            }
        
        component.set("v.enableInfiniteLoading", true);
        
    },
    
    handleSort : function(component, event, helper) {
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        // assign the latest attribute with the sorted column fieldName and sorted direction
        component.set("v.sortedBy", fieldName);
        component.set("v.sortedDirection", sortDirection);
        helper.sortData(component, fieldName, sortDirection);
    },
    
})