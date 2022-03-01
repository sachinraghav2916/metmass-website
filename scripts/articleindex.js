window.setTimeout(myFunction,5000);
function myFunction(){
    document.getElementById('events-preloader').style.display='none';
    console.log("hello");
}





//$(document).ready(function(){
//    $('select').formSelect();
//  });

$(".button-collapse").sideNav();

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

     

function showArticleForm(e){
e.preventDefault();
    document.getElementById('article-form-section').style.display='block';
    document.getElementById('add-article-container').style.display='none';
}

function hideArticleForm(e){
    e.preventDefault();
    document.getElementById('add-article-container').style.display='block';
    document.getElementById('article-form-section').style.display='none';
}




function ViewMore(e){
    e.preventDefault();
    var key=e.target.getAttribute('key');
    document.getElementById('outer-content-'+key).style.display='block';
    document.getElementById('view-more-'+key).style.display='none';
}


function ViewLess(e){
    e.preventDefault();
    var key=e.target.getAttribute('key');
    document.getElementById('outer-content-'+key).style.display='none';
    document.getElementById('view-more-'+key).style.display='inline-block';
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
