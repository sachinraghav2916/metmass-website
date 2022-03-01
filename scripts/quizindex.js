//logout function

function logout2(e){
e.preventDefault();
    auth.signOut();
  
}

window.setTimeout(myFunction,10000);
function myFunction(){
    document.getElementById('events-preloader').style.display='none';
}





function MoreInfoFunction(e){
    e.preventDefault();
    var key=e.target.getAttribute('key');
    
    document.getElementById('moreInfo-section-'+key).style.display='block';
    document.getElementById('moreInfo-'+key).style.display='none';
}


function LessInfoFunction(e){
    e.preventDefault();
    var key=e.target.getAttribute('key');
    document.getElementById('moreInfo-section-'+key).style.display='none';
    document.getElementById('moreInfo-'+key).style.display='inline-block';
}



//quiz form

const addQuizButton=document.getElementById('addQuizButton');

const hideQuizButton=document.getElementById('hideQuizFormButton');

addQuizButton.addEventListener('click',(e)=>{
    e.preventDefault();
    
    document.getElementById('addQuiz').style.display='inline-block';
    addQuizButton.style.display='none';
})

hideQuizButton.addEventListener('click',(e)=>{
    e.preventDefault();
    document.getElementById('addQuiz').style.display='none';
    addQuizButton.style.display='inline-block';
})





//adding new quiz to the database

function writeNewQuiz(uid,quizNumber,name,date,duration,questions,syllabus,organiser,type,registrations) {
  // A post entry.
  var quizData = {
   uid:uid,
   quizNumber:quizNumber,
   quizName:name,
      quizDate:date,
      quizDuration:duration,
      quizQuestions:questions,
      quizSyllabus:syllabus,
      quizType:type,
      quizRegistrations:registrations,
      quizOrganiser:organiser
  };

  // Get a key for a new Post.
  var newQuizKey = firebase.database().ref().child('quizes').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/quizes/' + newQuizKey] = quizData;
  updates['/user-quizes/' + uid + '/' + newQuizKey] = quizData;

  return firebase.database().ref().update(updates).then(()=>{
      quizForm.reset();
      document.getElementById('addQuiz').style.display='none';
    addQuizButton.style.display='inline-block';
  })
}




//quiz-form

const quizForm=document.querySelector('#quiz-form');

quizForm.addEventListener('submit',(e)=>{
e.preventDefault();
    
    const quizNumber=quizForm['quiz-number'].value;
    const quizName=quizForm['quiz-name'].value;
    const quizDate=quizForm['quiz-date'].value;
    const quizDuration=quizForm['quiz-duration'].value;
    const quizQuestions=quizForm['quiz-questions'].value;
    const quizSyllabus=quizForm['quiz-syllabus'].value;
    const quizType=quizForm['quiz-type'].value;
    const quizRegistration=quizForm['quiz-registrations'].value;
    const quizOrganiser=quizForm['quiz-organiser'].value;
    
    
    
    auth.onAuthStateChanged(user=>{
   if(user){
       writeNewQuiz(user.uid,quizNumber,quizName,quizDate,quizDuration,quizQuestions,quizSyllabus,quizOrganiser,quizType,quizRegistration);
   }
    })
    
})




function RemoveQuiz(e){
    e.preventDefault();
    var key=e.target.getAttribute('key');
    var authorUid=e.target.getAttribute('authorUid');
    var userUid=e.target.getAttribute('userUid');
    
    var globalRef=firebase.database().ref('quizes/'+key);
    var userRef=firebase.database().ref('user-quizes/'+authorUid+'/'+key);
    
    if(userUid===authorUid){
        globalRef.remove();
        userRef.remove();
    }
}


function toggleRegister(quizRef,uid){
    quizRef.transaction(function(quiz){
        if(quiz){
            if(quiz.register && quiz.register[uid]){
                quiz.register[uid]=null;
            }
        else{
            if(!quiz.register){
                quiz.register={};
            }
            quiz.register[uid]=true;
        }
        }
        return quiz;
    })
}




function quizElement(key,name,organiser,date,duration,type,questions,syllabus,authorUid,userUid){
    var html=`<div class="white QuizCard col s12 quiz-${key}" key=${key}>
                    <div class="image-card col s4 l3 m4 right">
                        <img src="photos/mQuiz.png" class="quizImage">
                    </div>

                    <div class="cardContent s8 l9 m8 center">
                        <span class="quizHeading">${name}</span>

                        <div class="contentButton left">
                            <span class=""><a class="register-button register-${key}">Register</a></span>
                            <span class=""><a class="leaderboardButton">Leaderboard</a></span>
                        </div>
                        <div class="authorSection">
                            <a href="#" class="profilePhoto btn-floating " style="background-image:url('photos/metmass-logo.jpeg')"></a>
                            <span class="authorName"><b>Organiser:</b>${organiser}</span>
                        </div>
                    </div>
                    
                    <div class="cardAction col s12">
                        <span class="eventDate"><b>${date}</b></span>
                        <span class="eventDuration">Duration: ${duration}</span>
                        <span class="eventType">${type}</span>
                        <span class="moreInfo " id="moreInfo-${key}" key=${key} onclick="MoreInfoFunction(event)"><a class="" href="#" key=${key}> more-info</a></span>
                        <span class="removeQuiz red-text adminButton" style="display:none;" id="removeQuiz" onclick="RemoveQuiz(event)" authorUid=${authorUid} userUid=${userUid} key=${key}>Remove</span>
                    </div>


                    <div style="display: none;" class="viewMore-quiz col s12" id="moreInfo-section-${key}">
                        <span class="totalQuestions">Total-Questions: ${questions}</span><br>
                        <span class="syllabus">Syllabus: ${syllabus}</span>
                        <span class="lessInfo right blue-text" id="lessInfo-${key}" key=${key} onclick="LessInfoFunction(event)">viewless</span>
                    </div>
                </div>`;
    
    var div=document.createElement('div');
    div.innerHTML=html;
    var quizElement=div.firstChild;
    
    
    var register=quizElement.getElementsByClassName('register-button')[0];
    
    
    //listen for the register status
    
    var registerRef=firebase.database().ref('quizes/'+key+'/register/'+userUid);
    registerRef.on('value',function(snapshot){
        updateQuizStatusByCurrentUser(quizElement,snapshot.val());
    })
    
  //binding function
    
    var onRegisterClicked=function(){
        var globalArticleRef=firebase.database().ref('quizes/'+key);
        var userArticlesRef=firebase.database().ref('user-quizes/'+userUid+'/'+key);
        toggleRegister(globalArticleRef,userUid);
        toggleRegister(userArticlesRef,userUid);
    }
      register.onclick=onRegisterClicked;
    
    return quizElement;
}


//update register status by current user

function updateQuizStatusByCurrentUser(quizElement,register){
    if(register){
        quizElement.getElementsByClassName('register-button')[0].innerText='Registered';
        quizElement.getElementsByClassName('register-button')[0].setAttribute('class','register-button green white-text');
    }
    else{
        
         quizElement.getElementsByClassName('register-button')[0].innerText='Register'; 
        quizElement.getElementsByClassName('register-button')[0].setAttribute('class','register-button white blue-text');
    }
}






function fetchQuiz(user){
    var quizRef=firebase.database().ref('quizes/');
    var quizContainer=document.getElementById('quiz-container');
    var container=quizContainer.getElementsByClassName('allQuizes')[0];
    
      container.innerHTML='';
    
    quizRef.on('child_added',function(data){
 container.insertBefore(quizElement(data.key,data.val().quizName,data.val().quizOrganiser,data.val().quizDate,data.val().quizDuration,data.val().quizType,data.val().quizQuestions,data.val().quizSyllabus,data.val().uid,user.uid),container.firstChild);
    })
    
    
    quizRef.on('child_removed',function(data){
        var quizElement=container.getElementsByClassName('quiz-'+data.key)[0];
        quizElement.parentElement.removeChild(quizElement);
    })
}





auth.onAuthStateChanged(user=>{
    if(user){
        fetchQuiz(user);
        
        
          const loggedInLinks = document.querySelectorAll(".loggedIn");
            const loggedOutLinks = document.querySelectorAll(".loggedOut");
            const loggedInOut = document.querySelectorAll(".loggedInOut");
            
            loggedInOut.forEach(data => {
                data.style.display = 'block';
            })
            
            
            loggedInLinks.forEach(data => {
                data.style.display = 'block'
            })

            loggedOutLinks.forEach(data => {
                data.style.display = 'none';
            })
            
        
        
        
        
        var adminRef=firebase.database().ref('article-admin');
        var admins=[];
        adminRef.on('child_added',function(data){
            admins.push(data.val());
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
        })
        
        
        
    }
    else{
        
        
         const loggedInOut = document.querySelectorAll(".loggedInOut");
        loggedInOut.forEach(data => {
            data.style.display = 'block';
        })

        const loggedInLinks = document.querySelectorAll(".loggedIn");
        const loggedOutLinks = document.querySelectorAll(".loggedOut");
        loggedInLinks.forEach(data => {
            data.style.display = 'none'
        })
        loggedOutLinks.forEach(data => {
            data.style.display = 'block';
        })
        
        
        var user={
        uid:'1234567890',
        name:'Ananomys'
        };
        
        fetchQuiz(user);
    }
})







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


//Logout modal

const logoutButton=document.getElementById('logout1');
logoutButton.addEventListener('click',(e)=>{
    e.preventDefault();
    auth.signOut().then(()=>{
        console.log("user logged out");
    })
})

function logout2(e){
e.preventDefault();
 e.preventDefault();
    auth.signOut().then(()=>{
        console.log("user logged out");
    })
}









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





