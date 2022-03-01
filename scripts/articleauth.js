var userUid='';
auth.onAuthStateChanged(user=>{
    if(user){
        userUid=user.uid;
        fetchArticles(user);
     }
    else{
        fetchArticles('');
    }
})




//Adding new article to the database.

function writeNewArticle(uid,articleTitle,articleAbstract,authorName,articleType,reviewedBy,articleURL) {
  // Article entry.
    const date=new Date();
    
var ddate=date.toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"});
    
  var articleData = {
    uid:uid,
    articleTitle:articleTitle,
    articleAbstract:articleAbstract,
    authorName:authorName,
    articleType:articleType,
    reviewedBy:reviewedBy,
    likesCount:0,
    commentCount:0,
    articleDate:ddate,
    articleURL:articleURL
    
  };

  // Get a key for a new Article.
  var newArticleKey = firebase.database().ref().child('articles').push().key;

  // Write the new article's data simultaneously in the articles list and the user's article list.
  var updates = {};
  updates['/articles/' + newArticleKey] = articleData;
  updates['/user-articles/' + uid + '/' + newArticleKey] = articleData;

  return firebase.database().ref().update(updates).then(()=>{
    articleForm.reset();
    document.getElementById('add-article-container').style.display='block';
    document.getElementById('article-form-section').style.display='none';
  })
}





//working with the form data of the articles

const articleForm=document.querySelector('#article-form');

articleForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    
    var articleTitle=articleForm['article-title'].value;
    var articleAbstract=articleForm['article-abstract'].value;
    var authorName=articleForm['author-name'].value;
    var articleType=articleForm['article-type'].value;
    var reviewedBy=articleForm['reviewedBy'].value;
    var articleURL=articleForm['article-url'].value;
    
    auth.onAuthStateChanged(user=>{
     writeNewArticle(user.uid,articleTitle,articleAbstract,authorName,articleType,reviewedBy,articleURL);  
    })
})




 var name='sachin';

var intials = name.charAt(0);
var profileImage = $('#profileImage').text(intials);





//star and unstar

function toggleStar(articleRef,uid){
    articleRef.transaction(function(article){
        if(article){
            if(article.stars && article.stars[uid]){
                article.likesCount--;
                article.stars[uid]=null;
            }
            else{
                article.likesCount++;
                if(!article.stars){
                    article.stars={};
                }
                 article.stars[uid]=true;
            }
        }
        return article;
    })
}






var count=0;
var authorUid='';
var articleKey='';

 
 
 
 
 
 
 





//return articles element


function articleElement(key,title,abstract,author,date,starCount,commentCount,articleType,reviewedBy,userUid,authorUid,photo,articleURL){
    var html=`<div class="col s12  white outerCard largeCard article-${key}" data-id=${key}>
                   <div class="row innerCard">
                       <div class="cardStacked left col s12  l12 m12">
                           <span class="removeArticleButton right adminLink red-text" style="display:none"><a href="#" class="blue-text" data-id=${key} onclick="removeArticleFunction(event)">remove</a></span>
                           <div class="cardContent left">

                               <span class="title">${title}</span>
                               <span class="content"><b>Abstract:</b>${abstract}
                               </span>
                           </div>
                       </div>
                       <div class="cardAction1 col s12 l12">
                           <div class="authorSection">
                               <a href="#" class="profilePhoto btn-floating profilePic" id="articleAuthorProfile-${key}" style="background-image:url('${photo}')" onclick="ArticleProfileClicked(event)" key=${key} authorUid=${authorUid}></a>
                               <span class="articleAuthorPhoto"><input type="file" id="articleAuthorPhoto-${key}" style="display:none;" key=${key}></span>
                          <span class="progessBar green-text" id="progressPhoto-${key}" style="display: none;"></span>
                               <span class="authorName"><b>Author:</b>${author}</span>
                           </div>
                           <div class="">
                               <span class="eventDate">${date}</span>
                               <span class="star"><i class="material-icons starred">star</i>(<span class="star-count">${starCount}</span>)</span>
                               <span class="comments"><a href="#commentModal" class="modal-trigger" onclick="commentFunction(event)" key=${key} authorUid=${authorUid}>comments</a>(<span class="comment-count">${commentCount}</span>)</span>
                               <span class="eventType">${articleType}</span>

                               <span class="downloadArticle" id="downloadArticle-${key}">
                              <a href="${articleURL}"  key=${key} authorUid=${authorUid}>
                              Download
                              <i class="material-icons black-text icon" key=${key}>download</i>
                                </a>
                              </span>

                                      <span class="progressPdf" id="progressPdf-${key}" style="display:none;"></span>
                               <span class="moreInfo" id="view-more-${key}"><a class="blue-text" href="#" key=${key} onclick="ViewMore(event)">view more...</a></span>
                           </div>
                       </div>
                   </div>




                   <div class="outerContent" style="display: none;" id="outer-content-${key}">
                       <span class="fullContent"><b>ABSTRACT</b><br>
                           ${abstract}
                       </span>
                       <div class="cardAction2">
                           <span class="downloadArticle">Download<i class="material-icons green-text">download</i></span>
                           <span class="review"><b>Reviewed by:</b>${reviewedBy}</span>
                           <span class="lessInfo" id="view-less-${key}"><a class="blue-text" href="#" key=${key} onclick="ViewLess(event)">view less...</a></span>
                       </div>
                   </div>
               </div>`;
    
    var div=document.createElement('div');
    div.innerHTML=html;
    var articleElement=div.firstChild;

    var star=articleElement.getElementsByClassName('starred')[0];
    
    
    //listen for the profile photos
    
     auth.onAuthStateChanged(user=>{
         if(user){
             checkAdmins(user);
         }
     })
    
    
    //listen for the likes Count
    var starCountRef=firebase.database().ref('articles/'+key+'/likesCount');
    starCountRef.on('value',function(snapshot){
        updateStarCount(articleElement,snapshot.val());
    })
    
    //listen for the starred status
    var starredStatusRef=firebase.database().ref('articles/'+key+'/stars/'+userUid);
    starredStatusRef.on('value',function(snapshot){
        updateStarredByCurrentUser(articleElement,snapshot.val());
    })
    
    //Bind starring action
    var onStarClicked=function(){
        var globalArticleRef=firebase.database().ref('articles/'+key);
        var userArticlesRef=firebase.database().ref('user-articles/'+userUid+'/'+key);
        toggleStar(globalArticleRef,userUid);
        toggleStar(userArticlesRef,userUid);
    };
    
    star.onclick=onStarClicked;
    
    return articleElement;
}
 

//update the starred status of the article

function updateStarredByCurrentUser(articleElement,starred){
    if(starred){
        articleElement.getElementsByClassName('starred')[0].setAttribute('class','material-icons starred blue-text darken-4');
    }
    else{
      articleElement.getElementsByClassName('starred')[0].setAttribute('class','material-icons starred black-text');  
    }
}



//update counting of the stars
function updateStarCount(articleElement,nbStart){
    articleElement.getElementsByClassName('star-count')[0].innerText=nbStart;
}





//listening for the article database....

function fetchArticles(user){
    var uid=user.uid;
    var allArticles=document.getElementById('all-articles');
    var articleRef=firebase.database().ref('articles');
      var container=allArticles.getElementsByClassName('articleSection')[0]; 
      container.innerHTML='';
    var commentContainer=document.getElementById('commentsElementContainer');
    //on new article added
    articleRef.on('child_added',(snapshot)=>{
         
       commentContainer.insertBefore(createPostComment(snapshot.key,snapshot.val().uid,user),commentContainer.firstChild);
        
        var photoRef=firebase.database().ref('articleAuthorPhotos/'+snapshot.key);
    
    photoRef.once('value',function(data){
       
        if(data.val()){
            container.insertBefore(articleElement(snapshot.key,snapshot.val().articleTitle,snapshot.val().articleAbstract,snapshot.val().authorName,snapshot.val().articleDate,snapshot.val().likesCount,snapshot.val().commentCount,snapshot.val().articleType,snapshot.val().reviewedBy,uid,snapshot.val().uid,data.val().photo,snapshot.val().articleURL),container.firstChild);
                 }
        else{
             container.insertBefore(articleElement(snapshot.key,snapshot.val().articleTitle,snapshot.val().articleAbstract,snapshot.val().authorName,snapshot.val().articleDate,snapshot.val().likesCount,snapshot.val().commentCount,snapshot.val().articleType,snapshot.val().reviewedBy,uid,snapshot.val().uid,'https://lh3.googleusercontent.com/a/AATXAJzYnCLMysTa71lEWprLyio1N66MH0oExCdP8ukT=s96-c',snapshot.val().articleURL),container.firstChild);
           }
    })

       
    })
    
    
    
    
    
    //on any change in any article...
    
    articleRef.on('child_changed',(snapshot)=>{
        var container=allArticles.getElementsByClassName('articleSection')[0];
        var articleElement=container.getElementsByClassName('article-'+snapshot.key)[0];
        
        articleElement.getElementsByClassName('star-count')[0].innerText=snapshot.val().likesCount;
        
        articleElement.getElementsByClassName('comment-count')[0].innerText=snapshot.val().commentCount;
        
    })
    
    
    
   //on any article removed
    
    articleRef.on('child_removed',(snapshot)=>{
        var container=allArticles.getElementsByClassName('articleSection')[0];
        var articleElement=container.getElementsByClassName('article-'+snapshot.key)[0];
        articleElement.parentElement.removeChild(articleElement);
    })
    
}

var uid=userUid;





//remove article function

function removeArticleFunction(e){
    e.preventDefault();
    var uid=userUid;
    var articleId=e.target.getAttribute('data-id');
    console.log(articleId);
    var globalRef=firebase.database().ref('articles/'+articleId);
    var userRef=firebase.database().ref('user-articles/'+uid+'/'+articleId);
   globalRef.remove();
   userRef.remove();
}




//article author profile clicked

function ArticleProfileClicked(e){
    e.preventDefault();
    var key=e.target.getAttribute('key');
    var authorUid=e.target.getAttribute('authorUid');
    
    auth.onAuthStateChanged(user=>{
        if(user){
            if(user.uid===authorUid){
                document.getElementById('articleAuthorPhoto-'+key).style.display='inline-block';
                
                var file=document.getElementById('articleAuthorPhoto-'+key);
                console.log(file);
               file.addEventListener('change',handleFileSelect2,false);
                
            }
        }
    })
}



//upload article Button clicked

//function downloadButtonClicked(e){
//    e.preventDefault();
//    var key=e.target.getAttribute('key');
//    var element=document.getElementById('downloadArticle-'+key);
//    var upload=element.getElementsByClassName('upload')[0];
//    var authorUid=e.target.getAttribute('authorUid');
//    
//    auth.onAuthStateChanged(user=>{
//        if(user){
//            if(user.uid===authorUid){
//                var file=document.getElementById('articlePdf-'+key);
//                 file.style.display='inline-block';
//                console.log(file);
//                 file.addEventListener('change',handleFileSelect3,false);
//                
//            }
//        }
//    })
//}



function handleFileSelect3(evt){
    console.log('helo');
    evt.stopPropagation();
    evt.preventDefault();
//    var file=evt.target.files[0];
//    console.log(file);
//    key=evt.target.getAttribute('key');
//    
//    var metadata={
//        'contentType':file.type
//    }
//    
//    auth.onAuthStateChanged(user => {
//        var Ref = storageRef.child('articlePdf/' + key).put(file, metadata);
//        Ref.then(function (snapshot) {
//            snapshot.ref.getDownloadURL().then(function (url) {
//               firebase.database().ref('articlePdf/'+key).update({photo:url}).then(()=>{
//                   document.getElementById('articlePdf-'+key).style.display='none';
//                   var Progress=document.getElementById('progressPdf-'+key);
//            Progress.style.display='none';
//               })
//            })
//
//        })
//        
//         Ref.on('state_changed',(snapshot)=>{
//            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//            var Progress=document.getElementById('progressPdf-'+key);
//            Progress.style.display='inline-block';
//            Progress.innerText=Math.floor(progress)+'%';
//          //console.log('Upload is ' + Math.floor(progress) + '% done');
//            // console.log(progress);
//        })
//        
//    })
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
        var Ref = storageRef.child('articleAuthorPhotos/' + key).put(file, metadata);
        Ref.then(function (snapshot) {
            snapshot.ref.getDownloadURL().then(function (url) {
               firebase.database().ref('articleAuthorPhotos/'+key).update({photo:url}).then(()=>{
                   document.getElementById('articleAuthorPhoto-'+key).style.display='none';
                   var Progress=document.getElementById('progressPhoto-'+key);
            Progress.style.display='none';
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



//fetching all photo urls





















