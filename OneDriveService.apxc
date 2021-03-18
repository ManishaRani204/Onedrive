public class OneDriveService {
    
    private string clientId = 'f11b6502-39ad-4dd5-b099-1e28a939afef';
    private string clientSecret = 'aa_A1TDqc~hA47A._1v7L-yqry.Dma.L7k';
    private string scope = 'https://graph.microsoft.com/.default';
    private string grantType = 'client_credentials';
    private string tokenUrl = 'https://login.microsoftonline.com/828d38f7-7608-4201-8746-f8afebbfc437/oauth2/v2.0/token';
    private string redirectUrl  = 'https://www.google.com';
     
    public string getAccessToken()
    {
        String key = EncodingUtil.urlEncode(clientId,'UTF-8');
        String secret = EncodingUtil.urlEncode(clientSecret,'UTF-8');
        HttpRequest req = new HttpRequest();
        req.setMethod('POST');
        req.setEndpoint(tokenUrl);
        req.setHeader('content-type', 'application/x-www-form-urlencoded');
        
        String messageBody='client_id='+key+
            '&scope=https://graph.microsoft.com/.default'+
            '&client_secret='+secret+
            '&redirect_uri='+redirectUrl+
            '&grant_type=client_credentials';   
        req.setHeader('Content-length', String.valueOf(messageBody.length()));
        req.setBody(messageBody);
        req.setTimeout(60*1000);
        
        Http callout = new Http();
        String responseText;
        HttpResponse response = callout.send(req);
        system.debug('response:' + response.getBody());
        
        if(response.getStatusCode()==200)
        {            
            responseText = response.getBody();
            Map<String,object> responseMap =(Map<String,object>)JSON.deserializeUntyped(responseText) ;  
            string token=String.valueOf(responseMap.get('access_token'));
            system.debug('responseMap:' + responseMap);
            return token;
        }
        return '';
    }    
    
     public void UploadDocuments(string recordId)
    {
        string accessToken=getAccessToken();      
        List<ContentDocumentLink> links=[SELECT ContentDocumentId,LinkedEntityId FROM ContentDocumentLink where LinkedEntityId=:recordId];
        Set<Id> ids=new Set<Id>();
        for(ContentDocumentLink link:links)
        {
            ids.add(link.ContentDocumentId);
        }
        List<ContentVersion> versions=[SELECT VersionData,Title,ContentDocumentId,FileExtension FROM ContentVersion WHERE ContentDocumentId = :ids AND IsLatest = true];
        
        for(ContentVersion attach:versions)
        {
            try
            {
                uploadFile(accessToken, attach.VersionData, attach.Title, attach.FileExtension);
            }
            catch(Exception ex)
            {
               // throw new BaseException(ex);
            }
        }
    }
    
     @Future(callout=true)
    public static void uploadFile(string accessToken,blob versionData,string title,string extn){
        
        String attachmentBody = EncodingUtil.base64Encode(versionData);        
        String filename = title;
        string contentType=ContentType(extn);
        
        string endpointUrl='https://graph.microsoft.com/v1.0/users/8928440c-0c31-4112-abf8-5ac9f346aa99/drive/items/root:/{file}:/content';
        string file=EncodingUtil.URLENCODE(filename,'UTF-8').replace('+', '%20');
        endpointUrl=endpointUrl.replace('{file}',file+'.'+extn);
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpointUrl);
        req.setMethod('PUT'); 
        req.setHeader('Authorization','Bearer ' + accessToken);
        req.setHeader('Content-Encoding', 'UTF-8');
        req.setHeader('Content-type', contentType);
        req.setHeader('accept', 'application/json');
        Http http = new Http();
        system.debug('getBody1 '+req);
        req.setBodyAsBlob(versionData);
        req.setTimeout(120000);
        
        HTTPResponse res = http.send(req);
        system.debug('getBody2 '+res.getBody());
        
        if(res.getStatusCode()==200)
        {
            system.debug('getBody '+res.getBody());
        }
    }
    
    public static string ContentType(string fileType)
    {
        switch on fileType.toLowerCase()
        {
            when 'docx'
            {
                return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            }
            when 'csv'
            {
                return 'application/vnd.ms-excel';
            }
            when 'wav'
            {
                return 'audio/wav';
            }
            when 'wmv'
            {
                return 'video/x-ms-wmv';
            }
            when 'mp3'
            {
                return 'audio/mpeg';
            }
            when 'mp4'
            {
                return 'video/mp4';
            }
            when 'png'
            {
                return 'image/png';
                
            }
            when 'pdf'
            {
                return 'application/pdf';
                
            }
            when 'txt'
            {
                return 'text/plain';
                
            }
            when else {
                return 'image/jpeg';
            }
        }
    }
}
