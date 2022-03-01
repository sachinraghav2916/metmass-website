var admins=[];


function writeUserData(userId,name,email,imageUrl){
    firebase.database().ref('users/'+userId).set({
        name:'||Anonmys||',
        photo:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png',
        email:email,
    });
}



function checkAdmins(user){

    const adminLink=document.querySelectorAll(".adminLink");
            
            if(admins.includes(user.email)){
                adminLink.forEach(data=>{
                    data.style.display='inline-block';
                })
            }
             else{
                 adminLink.forEach(data=>{
                     data.style.display='none';
                 })
             }
}



auth.onAuthStateChanged(user=>{
    if(user)
        {
            writeUserData(user.uid,user.displayName,user.email,user.photoURL);
            
            
            fetchAdmins();
            checkAdmins(user);
            
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
            
            
            
            if (user.email == "sraghav872@gmail.com") {

                document.getElementById('adminSection').style.display = "block";
            } else {
                document.getElementById('adminSection').style.display = "none";
            }
        }
    else {
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
    }
})




//admin element



//fetching admins


function adminElement(key,email){
    var html=`<div class="adminElement adminkey-${key}">
                              <span class="email">${email}</span>
                              <a class="btn-small wave-effect waves-light red right" onclick="removeAdmins(event)" admin=${email} key=${key}>remove</a>
                              </div><br>`;
    var div=document.createElement('div');
    div.innerHTML=html;
    var element=div.firstChild;
    return element;
}

function fetchAdmins(){
    var adminRef=firebase.database().ref('article-admin');
    var container=document.getElementById('adminsContainer');
        container.innerHTML='';
    
    adminRef.on('child_added',function(data){
        container.insertBefore(adminElement(data.key,data.val()),container.firstChild);
        admins.push(data.val());
        
            auth.onAuthStateChanged(user=>{
            if(user){
                 const adminLink=document.querySelectorAll(".adminLink");
            if(admins.includes(user.email)){
                adminLink.forEach(data=>{
                    data.style.display='block';
                })
            }
             else{
                 adminLink.forEach(data=>{
                     data.style.display='none';
                 })
             }
            }
        })
    })
    
    adminRef.on('child_removed',function(data){
          var element=container.getElementsByClassName('adminkey-'+data.key)[0];
         element.parentElement.removeChild(element);
        
        auth.onAuthStateChanged(user=>{
            if(user){
                 const adminLink=document.querySelectorAll(".adminLink");
            if(admins.includes(user.email)){
                adminLink.forEach(data=>{
                    data.style.display='block';
                })
            }
             else{
                 adminLink.forEach(data=>{
                     data.style.display='none';
                 })
             }
            }
        })
        
    })
}


//removeAdmins
function removeAdmins(e){
    e.preventDefault();
    var key=e.target.getAttribute('key');
    var adminRef=firebase.database().ref('article-admin/'+key);
    adminRef.remove();
}



const adminForm=document.querySelector('#addAdmins');

adminForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const email=adminForm['admin-email'].value;
    var adminRef=firebase.database().ref('article-admin');
    
    
    if(admins.indexOf(email)==-1){
        admins.push(email);
        adminRef.push(email).then(()=>{
            adminForm.reset();
        })
    }
})







