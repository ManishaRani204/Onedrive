({
    doInit:function(component,event,helper){  
         window.open('www.google.com',"","toolbar=no,status=no,menubar=no,location=center,scrollbars=no,resizable=no,height=500,width=657");          
     	
        //var dismissActionPanel = $A.get("e.force:closeQuickAction");
        //dismissActionPanel.fire();
        //$A.get('e.force:refreshView').fire(); 
        
        helper.getuploadedFiles(component); 
    },
    
   		handleUploadFinished : function(component, event,helper) {
        var uploadedFiles = event.getParam("files");
        helper.getuploadedFiles(component);
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "type" : "success",
            "message": uploadedFiles.length+" files has been uploaded successfully!"
        });
        toastEvent.fire();        
        $A.get('e.force:refreshView').fire();  
    },
    
    previewFile :function(component,event,helper){  
        var rec_id = event.currentTarget.id;  
        $A.get('e.lightning:openFiles').fire({ 
            recordIds: [rec_id]
        });  
    }  
})
