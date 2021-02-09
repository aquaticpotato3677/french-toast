let url = 'https://www.universalhub.com/toast.xml';
let colors = [9961371,9935359,16777024,16744989,16276824];
let toasturls = [
  'https://www.universalhub.com/images/2007/frenchtoastgreen.jpg',
  'https://www.universalhub.com/images/2007/frenchtoastblue.jpg',
  'https://www.universalhub.com/images/2007/frenchtoastyellow.jpg',
  'https://www.universalhub.com/images/2007/frenchtoastorange.jpg',
  'https://www.universalhub.com/images/2007/frenchtoastred.jpg'
];

function print(){
  let keys = PropertiesService.getScriptProperties().getKeys();
  for(let i=0; i<keys.length; i++){
    Logger.log(keys[i]+":"+PropertiesService.getScriptProperties().getProperty(keys[i]));
  }
}

function del(){
  PropertiesService.getScriptProperties().deleteProperty(PropertiesService.getScriptProperties().getKeys()[{index}]);
}

function clear(){
  PropertiesService.getScriptProperties().deleteAllProperties();
}

function doGet(){
  return HtmlService.createHtmlOutputFromFile("main.html");
}

function doPost(e){
  let url = e.parameter["URL"];
  let body = {
    'username':'French Toast Alert System',
    'content':'ready!'
  }
  let options = {
    'method':'post',
    'payload':body
  } 
  try{
    UrlFetchApp.fetch(url,options);
    PropertiesService.getScriptProperties().setProperty(url,"null");
    return HtmlService.createHtmlOutputFromFile("success.html");
  }catch(e){
    Logger.log(url);
    return HtmlService.createHtmlOutputFromFile("error.html");
  }
}

function frenchToast() {
  let xml = UrlFetchApp.fetch(url).getContentText();
  let str = xml.split('status');
  let actual = str[1].substring(1,str[1].length-2);
  let urls = PropertiesService.getScriptProperties().getKeys();
  for(let i=0; i<urls.length; i++){
    let thishook = urls[i];
    let thislevel = PropertiesService.getScriptProperties().getProperty(thishook);
    if(actual!=thislevel){
      let body = {
        'username':'French Toast Alert System',
        'avatar_url':toasturls[0],
        'embeds':[
          {
            'description':'French Toast Alert System Level has increased to: '+actual, 
            'color':colors[0], 
            "author": {
              "name": "universalhub.com/french-toast",
              "url": "https://universalhub.com/french-toast",
              "icon_url": "https://pbs.twimg.com/profile_images/1124504090682253312/akx3jj4r_400x400.jpg"
            }
          }
        ],
      }
      let num = Number(actual.substr(0,1));
      if(num<Number(thislevel.substring(0,1))){
        body.embeds[0].description='French Toast Alert System Level has decreased to: '+actual;
      }
      if(num>=1&&num<=5){
        body.avatar_url=toasturls[num-1];
        body.embeds[0].color = colors[num-1];
      }else Logger.log("ERROR: num="+num);
      
      let options = {
        'method':'post',
        'payload':{
          'payload_json':JSON.stringify(body)
        },
        'Content-Type':'application/json'
      }
      try{
        UrlFetchApp.fetch(thishook,options);
      }catch(e){
        PropertiesService.getScriptProperties().deleteProperty(thishook);
      }
      PropertiesService.getScriptProperties().setProperty(thishook,actual);
    }
  }
}
