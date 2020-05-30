({
    validateSearch : function(component, event, helper) {
        var fieldName = component.get("v.fieldName");
        var filter = component.get("v.filter");
        var filterValue = component.get("v.filterValue");
        var rawDataRows = JSON.parse(component.get("v.rawDataRows"));
        var type = component.get("v.selectedType");
        
        if(fieldName && filter && filterValue) {
            console.log("Filter Criteria", 'fieldName: '+fieldName+' ||filter: '+filter+' ||filterValue: '+filterValue);
            console.log(fieldName+''+ filter+''+filterValue);

            var filterQuery = { m: 'item.'+fieldName, o: filter, v: filterValue, t: type};
            console.log("filterQuery", filterQuery);
            console.log("rawDataRows", rawDataRows);
            helper.filterData(component, event, helper, rawDataRows, filterQuery);
        }
        else {
            console.log("Filter is not valid");
        }
    },
    
    filterData : function(component, event, helper, rawDataRows, filterQuery) {
        console.log("In filterData");
        //m:member,o:operator,v:value.
                
        var result = helper.applyFilter(component, event, helper, rawDataRows, filterQuery);
        console.log("result", result);
        
        var compEvent = component.getEvent("sendFilteredData");
        compEvent.setParams({"varEventFilteredData" : JSON.stringify(result), search: true });
        compEvent.fire();
        
    },
    
    applyFilter : function(component, event, helper, input, filter) {
        console.log("In applyFilter");
        if (filter == undefined) {
            return input;
        }
        
        var fun = helper.createFunc(component, event, helper,filter);
        console.log("fun", fun);
        var output = input.filter(fun);
        console.log("output", output);
        return output;
    },
    
    createFunc : function(component, event, helper, filter) {
        console.log("In createFunc");
        var body = helper.createBody(component, event, helper, filter);
        console.log("body", body);
        var f = new Function("item", " return " + body + ";");
        return f;
    },
    
    createBody : function(component, event, helper, filter) {
        console.log("In createBody");
        var o = filter.o;
        
        if(filter.t == 'date' || filter.t == 'datetime') {
            if(o == 'includes')
                return "new Date("+filter.m+")"+".includes("+"new Date(\'"+filter.v+"\'))";
            else if(o === '==' || o === '!=')
                return "new Date("+filter.m+").getTime()"+ " " + o + "  " + "new Date(\'"+filter.v+"\').getTime()";
            else
            	return "new Date("+filter.m+")"+ " " + o + "  " + "new Date(\'"+filter.v+"\')";
        } 
        else
        if(o == 'includes')
            return filter.m+".toLowerCase().includes(\'"+filter.v.toLowerCase()+"\')";
        else
        if (typeof filter.v == "string") 
            filter.v = "'" + filter.v + "'"
            
        console.log(filter.m+'.toLowerCase()' + " " + o + "  " + filter.v.toLowerCase());
        return filter.m+'.toLowerCase()' + " " + o + "  " + filter.v.toLowerCase();
    },
})