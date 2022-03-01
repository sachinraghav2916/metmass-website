//logout event

function logout2(e){
    e.preventDefault();
    auth.signOut();
}


window.setTimeout(myFunction,10000);
function myFunction(){
    document.getElementById('events-preloader').style.display='none';
}




//showing add event form section

const addEventButton = document.getElementById('add-event-button');
addEventButton.addEventListener('click',(e)=>{
    e.preventDefault();
  document.getElementById('event-form-container').style.display='block';
   addEventButton.style.display='none';

})

const hideFormButton=document.getElementById('eventForm-hide-button');
 hideFormButton.addEventListener('click',(e)=>{
     document.getElementById('event-form-container').style.display='none';
   addEventButton.style.display='inline-block';

})
 
 
 
 function writeNewEvent(uid,eventTitle,eventContent,eventType,eventDuration,eventOrganiser) {
      const date=new Date();
    
var ddate=date.toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"});
  // A post entry.
  var eventData = {
     uid:uid,
      eventTitle:eventTitle,
      eventContent:eventContent,
      eventType:eventType,
      eventDuration:eventDuration,
      eventOrganiser:eventOrganiser,
      eventDate:ddate
  };

  // Get a key for a new Post.
  var newEventKey = firebase.database().ref().child('events').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/events/' + newEventKey] = eventData;
  updates['/user-events/' + uid + '/' + newEventKey] = eventData;

  return firebase.database().ref().update(updates).then(()=>{
     
      eventForm.reset();
   document.getElementById('event-form-container').style.display='none';
   addEventButton.style.display='inline-block';
  })
}

 
 
 
 
 const eventForm=document.querySelector("#event-form");
 eventForm.addEventListener('submit',(e)=>{
    e.preventDefault();
     
     const eventTitle=eventForm['event-title'].value;
     const eventContent=eventForm['event-content'].value;
     const eventType=eventForm['event-type'].value;
     const eventDuration=eventForm['event-duration'].value;
     const eventOrganiser=eventForm['event-organiser'].value;
     
     auth.onAuthStateChanged(user=>{
   writeNewEvent(user.uid,eventTitle,eventContent,eventType,eventDuration,eventOrganiser)
     })
     
   })
 
 
 
 
 
 function viewMoreEvent(e){
     e.preventDefault();
     var key=e.target.getAttribute('key');
    
     document.getElementById('outer-content-'+key).style.display='block';
     document.getElementById('view-more-'+key).style.display='none';
 }

function viewLessEvent(e){
    e.preventDefault();
    
    var key=e.target.getAttribute('key');
    document.getElementById('outer-content-'+key).style.display='none';
     document.getElementById('view-more-'+key).style.display='inline-block';
}
 
 
 
function RemoveEvent(e){
    e.preventDefault();
    var key=e.target.getAttribute('key');
    var authorUid=e.target.getAttribute("authorUid");
    var userUid=e.target.getAttribute('userUid');
    
    var globalRef=firebase.database().ref('events/'+key);
    var userRef=firebase.database().ref('user-events/'+authorUid+'/'+key);
    if(userUid===authorUid){
        globalRef.remove();
        userRef.remove();
    }
}

 
 function eventElement(key,title,content,organiser,date,duration,type,authorUid,user,eventPhoto){
     var html=`<div class="col s12 m9 l9 white outerCard largeCard event-${key}" key=${key} authorUid=${authorUid} userUid=${user.uid}>
                <div class="row innerCard">
                    <div class="cardImageSmall right col s4 l3 m4">
                        <img src="${eventPhoto}" class="imageCardSmall right" onclick="EventProfileClicked(event)" key=${key} authorUid=${authorUid}>
                        <span class="uploadEventPhoto">
                           <input type="file" id="eventPhoto-${key}" key=${key} style="display:none;">
                       </span>
                       <span class="progressPhoto" id="progressPhoto-${key}" style="display: none"></span>
                    </div>

                    <div class="cardStacked left col s8  l9 m8">

                        <div class="cardContent left">
                            <span class="title">${title}</span>
                            <span class="content hide-on-small-only">${content}
                            </span>
                            <div class="authorSection">
                                <a href="#" class="profilePhoto btn-floating " style="background-image:url('photos/metmass-logo.jpeg')"></a>
                                <span class="authorName"><b>Organiser:</b>${organiser}</span>
                            </div>

                        </div>
                    </div>

                    <div class="cardAction1 col s12 l9">
                        <span class="eventDate"><b>${date}</b></span>
                        <span class="eventDuration">Duration:${duration} </span>
                        <span class="eventType">${type}</span>
                        <!--                            <span class="register"><a class="blue-text" href="#">Register</a></span>-->
                        <span class="moreInfo" id="view-more-${key}" onclick="viewMoreEvent(event)" key=${key}><a class="" href="#" key=${key}>view more...</a></span>
                    </div>
     <span class="eventRemove right adminButton"  onclick="RemoveEvent(event)" key=${key} style="display:none; margin-top:20px;">remove</span>
                </div>
                <div class="outerContent" style="display: none;" id="outer-content-${key}">

                    <span class="fullContent">${content}
                       </span>
                    <div class="cardAction2">
                        <span class="downloadBrochure">Brochure<i class="material-icons green-text">download</i></span>
                        <span class="eventDownloadLink"><a href="#" class="blue-text">Event<i class="material-icons">cloud_download</i></a></span>
                        <span class="registerEventButton "><a class="" style="opacity:.4;" href="#">Register</a></span>
                        <span class="lessInfo" id="view-less-${key}" onclick="viewLessEvent(event)" key=${key}><a class="blue-text" href="#" key=${key}>view less...</a></span>
                    </div>
                </div>
            </div>`;
     
     var div=document.createElement('div');
     div.innerHTML=html;
     var eventElement=div.firstChild;
     
     auth.onAuthStateChanged(user=>{
     if(user){
         checkAdmins(user);
     }   
     })
     
     return eventElement;
 }
 
 
 function fetchEvents(user){
 
     var globalRef=firebase.database().ref('events');
     
     var eventContainer=document.getElementById('event-container');
     var container=eventContainer.getElementsByClassName('events')[0];
      container.innerHTML='';
     
      globalRef.on('child_added',function(data){
       
          var ref=firebase.database().ref('eventPhotos/'+data.key);
          ref.once('value',function(snapshot){
               if(snapshot.val()){
                   container.insertBefore(eventElement(data.key,data.val().eventTitle,data.val().eventContent,data.val().eventOrganiser,data.val().eventDate,data.val().eventDuration,data.val().eventType,data.val().uid,user,snapshot.val().photo),container.firstChild)
               }
              else{
                  container.insertBefore(eventElement(data.key,data.val().eventTitle,data.val().eventContent,data.val().eventOrganiser,data.val().eventDate,data.val().eventDuration,data.val().eventType,data.val().uid,user,'photos/metmass-logo.jpeg'),container.firstChild)
              }
          })
          
      })
      
      
      
      globalRef.on('child_removed',function(data){
          var eventElement=container.getElementsByClassName('event-'+data.key)[0];
          eventElement.parentElement.removeChild(eventElement);
      })
     
 }
 

 var admins=[];

function checkAdmins(user){
    const adminButton=document.querySelectorAll('.adminButton');
            if(admins.includes(user.uid)){
                adminButton.forEach((data)=>{
                    data.style.display='inline-block';
                })
            }
            else{
                 adminButton.forEach((data)=>{
                    data.style.display='inline-block';
                })
            }
}

auth.onAuthStateChanged(user=>{
    if(user){
     fetchEvents(user);
        var adminRef=firebase.database().ref('article-admin');
        adminRef.on('child_added',function(data){
            admins.push(data.val());
            checkAdmins(user);
        })
        
    }  
    else{
        var usr={
            uid:'1234567890',
            name:'Anonmus'
           };
        fetchEvents(usr);
    }
})
 
 
 
 
 $(document).ready(function () {
    $('.modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        inDuration: 200, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '10%', // Ending top style attribute
        ready: function (modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
            //        alert("Ready");
            //  console.log(modal, trigger);
        },
        complete: function () {
           console.log("hello");
            var data1 = document.querySelectorAll('.AllContent');
            data1.forEach(doc => {
                doc.style.display = 'none';
            })


            var data = document.querySelectorAll('.allContent');
            data.forEach(doc => {
                doc.style.display = 'none';
            })

        }
        // Callback for Modal   close
    });
});

 
 





//article author profile clicked

function EventProfileClicked(e){
    e.preventDefault();
    var key=e.target.getAttribute('key');
    var authorUid=e.target.getAttribute('authorUid');
    
    auth.onAuthStateChanged(user=>{
        if(user){
            if(user.uid===authorUid){
                document.getElementById('eventPhoto-'+key).style.display='inline-block';
                
                var file=document.getElementById('eventPhoto-'+key);
                console.log(file);
               file.addEventListener('change',handleFileSelect2,false);
                
            }
        }
    })
}






 function handleFileSelect2(evt){
    evt.stopPropagation();
    evt.preventDefault();
    var file=evt.target.files[0];
    console.log(file);
    key=evt.target.getAttribute('key');
    
    var metadata={
        'contentType':file.type
    }
    
    auth.onAuthStateChanged(user => {
        var Ref = storageRef.child('eventPhotos/' + key).put(file, metadata);
        Ref.then(function (snapshot) {
            snapshot.ref.getDownloadURL().then(function (url) {
               firebase.database().ref('eventPhotos/'+key).update({photo:url}).then(()=>{
                   document.getElementById('eventPhoto-'+key).style.display='none';
                   var Progress=document.getElementById('progressPhoto-'+key);
            Progress.style.display='none';
                   fetchEvents(user);
               })
            })

        })
        
         Ref.on('state_changed',(snapshot)=>{
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            var Progress=document.getElementById('progressPhoto-'+key);
            Progress.style.display='inline-block';
            Progress.innerText=Math.floor(progress)+'%';
          //console.log('Upload is ' + Math.floor(progress) + '% done');
            // console.log(progress);
        })
        
    })
    }
 
 
 
 

//sign Up with email and password

const signupForm=document.querySelector('#signup-form');
signupForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const email=signupForm['sign-up-email'].value;
    const password=signupForm['sign-up-password'].value;
    
 auth.createUserWithEmailAndPassword(email,password).then(()=>{
  console.log("sign up successfully");
     $(document).ready(function(){
    $('.modal').modal('close');
  });
      
 })
})





//sign in with email and password

const signinForm=document.querySelector('#signin-form');
signinForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const email=signinForm['sign-in-email'].value;
    const password=signinForm['sign-in-password'].value;
    
    auth.signInWithEmailAndPassword(email,password).then(()=>{
        console.log("user logged in");
         $('.modal').modal('close');
    })
})
 
 
 