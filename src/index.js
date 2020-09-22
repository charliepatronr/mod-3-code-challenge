// write your code here

function loadPost() {
    const image = document.querySelector(".image")
    const imageCard = document.querySelector('.image-card')
    fetch('http://localhost:3000/images/1')
    .then(response => response.json())
    .then(response => {
        Array.from(imageCard.children).forEach(element =>{
            if(element.className == 'title'){
                element.setAttribute("data-id", `${response.id}`);
                element.textContent = response.title
            }
            else if(element.className == 'image'){
                element.src = response.image
            }
            else if(element.className == 'comments'){
                console.log(response.comments)
                let commentsDiv =''
                response.comments.forEach(comment =>{
                    commentsDiv +=
                    `<div class="ind-comment">
                        <li data-id="${comment.id}"> ${comment.content} </li>
                        <button class="delete-button">x</button>
                    </div>`
                })
                element.innerHTML = commentsDiv

            }
            else if (element.className == 'likes-section'){
                element.firstElementChild.textContent = `${response.likes} likes`
                const button = element.lastElementChild;
                button.setAttribute("data-id", `${response.id}`);
            }
            else if(element.className == 'comment-form'){
                element.setAttribute("data-id", `${response.id}`)
                element.addEventListener('submit', addComment)
            }
        })
        addImageListener()
    })
}

function addImageListener(){
    let imageCard = document.querySelector('.image-card')
    imageCard.addEventListener('click', function(e){
        if(e.target.className == 'delete-button'){
            deleteComment(e)
        }
        else if(e.target.className == 'like-button'){
            likes(e)
        }
        else if(e.target.className == 'down-vote-button'){
            downVote(e)
        }
    })
}

function likes(e){
    const elementId = parseInt(e.target.dataset.id)
    const numLikes = parseInt(e.target.previousElementSibling.previousElementSibling.textContent.split(' ')[0])
    let data = {
        'likes': numLikes + 1
    }
    const configObj = {
        method: 'PATCH',
        headers : {
            "Content-Type" : "application/json", 
            "Accept" : "application/json"
          },
        body: JSON.stringify(data)
    }
    fetch(`http://localhost:3000/images/${elementId}`, configObj)
    .then(response => response.json())
    .then(response => {
        e.target.previousElementSibling.previousElementSibling.textContent = `${response.likes} likes`
    })
}

function downVote(e){
    const elementId = parseInt(e.target.nextElementSibling.dataset.id)
    const numLikes = parseInt(e.target.previousElementSibling.textContent.split(' ')[0])
    let data = {
        'likes': numLikes - 1
    }
    const configObj = {
        method: 'PATCH',
        headers : {
            "Content-Type" : "application/json", 
            "Accept" : "application/json"
          },
        body: JSON.stringify(data)
    }
    fetch(`http://localhost:3000/images/${elementId}`, configObj)
    .then(response => response.json())
    .then(response => {
        e.target.previousElementSibling.textContent = `${response.likes} likes`
    })

}
function addComment(e){
    e.preventDefault()
    const comment = e.target['comment'].value ;
    const imgId = parseInt(e.target.dataset.id)
    let data = {
        'imageId': imgId, 
        'content': comment
    }
    const configObj = {
        method: 'POST',
        headers : {
            "Content-Type" : "application/json", 
            "Accept" : "application/json"
          },
        body: JSON.stringify(data)
    }

    fetch('http://localhost:3000/comments', configObj)
    .then(response => response.json())
    .then(response => {
        renderComments(response)
        e.target.reset()
    })
}

function renderComments(response){
    const commentSection = document.querySelector('.comments')
    let newComment =
    `<div class="ind-comment">
        <li data-id="${response.id}"> ${response.content} </li>
        <button class="delete-button">x</button>
    </div`
    commentSection.innerHTML += newComment;

}

function deleteComment(e){
    const commentId = parseInt(e.target.previousElementSibling.dataset.id)
    const configObj = {
        method: 'DELETE',
        headers : {
            "Content-Type" : "application/json", 
            "Accept" : "application/json"
          }
    }
    fetch(`http://localhost:3000/comments/${commentId}`, configObj)
    .then(response => response.json())
    .then(response => {
        e.target.parentNode.remove()
    })
}


function main(){
    loadPost()
}

main()