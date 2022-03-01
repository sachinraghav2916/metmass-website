
//creating a postCommentElement


function createPostComment(postId,authorId,user)
{
    var uid=user.uid;
    var html=`<div  style="display: none" class="AllContent " id=${postId + "comment"}>
            <div class="row>
    <div postId=${postId}>
     
    <div class="row>
    <div class="col s12">
   <div class="comments-container"></div></div>
   </div>
   <div class="col s12">
        <form id="comment-form" class="add-comment row" key=${postId}><br>
            <div class="input-field col s10 l8 m8" id="commentInput">
                <textarea class="materialize-textarea commentInput white" id="comment" style="" key=${postId}></textarea>
                <label for="comment">Add your Comment...</label>
            </div>
 <button class="  wave-effect waves-light  right btn grey lighten-4 black-text " id="editButton">Add</button>
        </form>
    <h6><span class="commentDemo"></span></h6>
    </div>
   </div></div></div>
      `;
    
    var div=document.createElement('div');
    div.innerHTML=html;
    var commentElement=div.firstChild;
    
    //Listen for comments.
    var commentsRef=firebase.database().ref('article-comments/'+postId);
    commentsRef.on('child_added',function(data){
addCommentElement(commentElement,postId,data.key,data.val().text,data.val().author,data.val().photoURL,data.val().uid,user);
        
    })
    
    commentsRef.on('child_changed',function(data){
        setCommentValues(commentElement,data.key,data.val().text,data.val().author,data.val().photoURL);
    })
    
    commentsRef.on('child_removed',function(data){
        deleteComment(commentElement,data.key);
    });
    
    
    
    
    var addCommentForm=commentElement.getElementsByClassName('add-comment')[0];
    addCommentForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        createNewComment(postId,user.displayName,authorId,user,addCommentForm['comment'].value);
        commentElement.getElementsByClassName('commentDemo') [0].innerHTML='<b><i>My Comment: </i></b>' +addCommentForm['comment'].value;
         addCommentForm.reset();
        addCommentForm.style.display='none';
    })
       
    return commentElement;
}


/**
 * Deletes the comment of the given ID in the given postElement.
 */
function deleteComment(commentElement, commentId) {
  var comment = commentElement.getElementsByClassName('comment-' + commentId)[0];
  comment.parentElement.removeChild(comment);
}

/**
 * Writes a new comment for the given post.
 */
function createNewComment(postId, username,authorId, user, text) {
    var userRef=firebase.database().ref('users/'+user.uid);
    userRef.once('value',function(data){
      firebase.database().ref('article-comments/' + postId).push({
    text: text,
    author: data.val().name,
    uid: user.uid,
    photoURL:data.val().photo
  }).then(()=>{
      var notificationRef=firebase.database().ref('notifications/'+authorId);
        var msg="Commented on your Post!!";
        var data={
            msg:msg,
            uid:user.uid,
            postId:postId
        }
        notificationRef.push(data);
      var globalPostRef = firebase.database().ref('/articles/' + postId);
    var userPostRef = firebase.database().ref('/user-articles/' + authorId+ '/' + postId);
        
          globalPostRef.transaction(function(post){
              if(post)
                  {
                // console.log(post)
              post.commentCount++;         
                  }
             return post;
          });
        userPostRef.transaction(function(post){
            if(post)
                  {
                //console.log(post)
              post.commentCount++;         
                  }
            return post;
        })
  })  
    })
}




//Removing comment

function RemoveComment(e) {
       // console.log(e.target);
        var commentId = e.target.getAttribute("commentId");
        var postId = e.target.getAttribute("postId");
        var authorId = e.target.getAttribute("authorId");
       // console.log(commentId, postId);
        var commentRef = firebase.database().ref('/article-comments/' + postId + '/' + commentId);
        commentRef.once('value', function (snapshot) {
           // console.log(snapshot.val().uid);
           auth.onAuthStateChanged(user => {
                if (user.uid === snapshot.val().uid) {
                    commentRef.remove().then(() => {
                        var globalPostRef = firebase.database().ref('/articles/' + postId);
                        var userPostRef = firebase.database().ref('/user-articles/' + authorId + '/' + postId);

                        globalPostRef.transaction(function (post) {
                            if (post) {
                                // console.log(post)
                                post.commentCount--;
                            }
                            return post;
                        });
                        userPostRef.transaction(function (post) {
                            if (post) {
                                //console.log(post)
                                post.commentCount--;
                            }
                            return post;
                        })
                    }).then(()=>{
                        return;
                    })
                }
            })
        })
    }



/**
 * Creates a comment element and adds it to the given postElement.
 */
function addCommentElement(commentElement,postId,commentId, text, author,photoURL,authorId,user) {
  var comment = document.createElement('div');
  comment.classList.add('comment-' + commentId);
  comment.innerHTML = `<div class="col s12 commentElement">
<b><span class="username commentAuthor"></span><b>
<a href="#" class="avatar1 right" style="background-image: url('${photoURL}')" onclick="ProfileClicked(event)" profileId=${authorId}></a> 
<br>
<h6><span class="comment"></span></h6>
<a href="#" class="deleteCommentButton red-text removeComment" onclick="RemoveComment(event)" authorId=${authorId} commentId=${commentId} postId=${postId} style="display:none;">Remove comment</a>
</div>`;
    if(authorId===user.uid)
        {
            comment.getElementsByClassName('deleteCommentButton')[0].style.display='inline-block';
        }
  comment.getElementsByClassName('comment')[0].innerText = text;
  comment.getElementsByClassName('username')[0].innerText = author || 'Anonymous';

  var commentsContainer= commentElement.getElementsByClassName('comments-container')[0];
  commentsContainer.appendChild(comment);
}










//comment Function

function commentFunction(e){
    e.preventDefault();
    var key=e.target.getAttribute("key");
    document.getElementById(key+"comment").style.display='block';
    var addCommentForm=document.querySelectorAll('.add-comment');
    addCommentForm.forEach(doc=>{ 
      doc.style.display='block';  
    })
}

