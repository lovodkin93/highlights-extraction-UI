/**
 * Gets a URL parameter from the query string
 */
 function turkGetParam( name, defaultValue ) { 
    var regexS = "[?&]"+name+"=([^&#]*)"; 
    var regex = new RegExp( regexS ); 
    var tmpURL = window.location.href; 
    var results = regex.exec( tmpURL ); 
    if( results == null ) { 
      return defaultValue; 
    } else { 
      return results[1];    
    } 
 }
 
 /**
  * URL decode a parameter
  */
 function decode(strToDecode)
 {
   var encoded = strToDecode;
   return unescape(encoded.replace(/\+/g,  " "));
 }
 
 
 /**
  * Returns the Mechanical Turk Site to post the HIT to (sandbox. prod)
  */
 export function turkGetSubmitToHost() {
     var defaultHost = "https://www.mturk.com";
     var submitToHost = decode(turkGetParam("turkSubmitTo", defaultHost));
     if (stringStartsWith(submitToHost, "https://")) {
         return submitToHost;
     }
     if (stringStartsWith(submitToHost, "http://")) {
         return submitToHost;
     }
     if (stringStartsWith(submitToHost, "//")) {
         return submitToHost;
     }
     return defaultHost;
 }
 
 export function turkGetAssignmentId() {
   const assignmentID = turkGetParam('assignmentId', "");
   return assignmentID;
 }
 
 
 /**
  * Sets the assignment ID in the form. Defaults to use mturk_form and submitButton
  */ 
 function turkSetAssignmentID( form_name, button_name ) {
 
   if (form_name == null) {
     form_name = "mturk_form";
   }
 
   if (button_name == null) {
     button_name = "submitButton";
   }
 
   const assignmentID = turkGetParam('assignmentId', "");
   const submit = document.getElementById('assignmentId');
   submit.value = assignmentID;
 
   if (!assignmentID || (assignmentID === "ASSIGNMENT_ID_NOT_AVAILABLE")) { 
     // If we're previewing, disable the button and give it a helpful message
     const btn = document.getElementById(button_name);
     if (btn) {
       btn.disabled = true; 
       btn.value = "You must ACCEPT the HIT before you can submit the results.";
       btn.innerHTML = "You must ACCEPT the HIT before you can submit the results."
     } 
   }
 
   const form = document.getElementById(form_name); 
   if (form) {
      form.action = turkGetSubmitToHost() + "/mturk/externalSubmit"; 
   }
 }
 
 // Inlined functionality for String.startsWith as IE does not support that method.
 // Function body from:
 // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#Polyfill
 function stringStartsWith(str, search, pos) {
     pos = (!pos || pos < 0) ? 0 : +pos;
     return str.substring(pos, pos + search.length) === search;
 }




 const handleSubmit = (assignmentId, turkSubmitTo, doc_json, summary_json, doc_paragraph_breaks, docName, summaryName, g_completed, g_guided_annotation_history) => {
    // const urlParams = new URLSearchParams(window.location.search)
   
    // create the form element and point it to the correct endpoint
    const form = document.createElement('form')
    // form.action = (new URL('mturk/externalSubmit', urlParams.get('turkSubmitTo'))).href
    form.action = turkSubmitTo + "/mturk/externalSubmit"; 
    form.method = 'post'
   
    // attach the assignmentId
    const inputAssignmentId = document.createElement('input')
    inputAssignmentId.name = 'assignmentId'
    // inputAssignmentId.value = urlParams.get('assignmentId')
    inputAssignmentId.value = assignmentId
    inputAssignmentId.hidden = true
    form.appendChild(inputAssignmentId)
    
    // // attach if completed the guided annotation
    // const completed_guided_annotation = document.createElement('input')
    // completed_guided_annotation.name = 'completed_guided_annotation'
    // completed_guided_annotation.value = JSON.stringify(g_completed)
    // completed_guided_annotation.hidden = true
    // form.appendChild(completed_guided_annotation)

    // // attach if completed the guided annotation
    // const guided_annotation_history = document.createElement('input')
    // guided_annotation_history.name = 'guided_annotation_history'
    // guided_annotation_history.value = JSON.stringify(g_guided_annotation_history)
    // guided_annotation_history.hidden = true
    // form.appendChild(guided_annotation_history)

    // // attach doc_json data
    // const inputDocJson = document.createElement('input')
    // inputDocJson.name = 'doc_json'
    // inputDocJson.value = JSON.stringify(doc_json)
    // inputDocJson.hidden = true
    // form.appendChild(inputDocJson)

    // // attach summary_json data
    // const inputSummaryJson = document.createElement('input')
    // inputSummaryJson.name = 'summary_json'
    // inputSummaryJson.value = JSON.stringify(summary_json)
    // inputSummaryJson.hidden = true
    // form.appendChild(inputSummaryJson)
   


    // attach results
    const inputResultJson = document.createElement('input')
    inputResultJson.name = 'results'
    inputResultJson.value = JSON.stringify({"doc_json":doc_json, "summary_json":summary_json, "doc_paragraph_breaks":doc_paragraph_breaks, "docName":docName, "summaryName":summaryName})
    inputResultJson.hidden = true
    form.appendChild(inputResultJson)



    // attach the form to the HTML document and trigger submission
    document.body.appendChild(form)
    form.submit()
  }
  
  export { handleSubmit }