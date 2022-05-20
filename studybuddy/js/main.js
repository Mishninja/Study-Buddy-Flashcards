function onPageLoad() {
    // localStorage.clear();
    var closeBtn = document.getElementById("close-btn");
    var revealBtn = document.getElementById("reveal");
    
    var checkBtn = document.getElementById("check");
    var editBtn = document.getElementById("edit");

    var confirmMsg = document.getElementById("confirm-msg");
    var createContainer = document.getElementById("create-container");
    var cardContainer = document.getElementById("card-container");
    var id;

    //get & display questions already in local storage
    var flashdeck = retrieveQuestions();
    if(flashdeck.length > 0) {
        //get current id
        var len = flashdeck.length;
        id = flashdeck[len-1].id+1;
    } else if(flashdeck.length == 0){
        id = 1;
    }
    
    for(let i=0; i<flashdeck.length;i++){
       displayQuestion(cardContainer, flashdeck[i]);
   }
    

    //close question form
    function closeQuestionForm() {
        if(!createContainer.classList.contains("hide")){
            createContainer.classList.add("hide");
        } else {
            return;
        }
    }
    closeBtn.addEventListener('click', closeQuestionForm);

    //reveal question form
    function revealQuestionForm(){
        if(createContainer.classList.contains("hide")) {
            createContainer.classList.remove("hide");
        } else {
            return;
        }
    }
    revealBtn.addEventListener('click',revealQuestionForm);

    //Add a new question (save)
    function addQuestion() {
        var question = document.getElementById("question").value;
        var answer = document.getElementById("answer").value;
        var flashdeck = retrieveQuestions();
        if(question == "" || answer == ""){
            alert('Please fill in fields');
        } else {
            var question = new Question(id,question,answer);
        flashdeck.push(question);
        window.localStorage.setItem('flashdeck', JSON.stringify(flashdeck));
        //pass in the div holding all the cards
        displayQuestion(cardContainer, question);
        }
    }
    var saveBtn = document.getElementById("save");
    saveBtn.addEventListener('click', addQuestion);

    //addQuestion Helper: retrieve questions from local storage
    function retrieveQuestions(){
        var deck = window.localStorage.getItem('flashdeck');
        if(deck) {
            var parsedDeck = JSON.parse(deck);
            return parsedDeck;
        } else {
            return deck = [];
        }   
    }
    
    //addQuestion Helper: display question card in the card container div
    function displayQuestion(cardContainer, question) {
        var card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = 
        `<div class="inner-card">
            <div class="front">
                <div class="close" id="delete-btn" data-id=${question.id}></div>
                <div class="content" id="front-content">
                    <h3>Q:</h3>
                    <h4 id="question">${question.question}</h4>
                    <div class="buttons">
                        <button class="btn-primary" id="check" data-id=${question.id}>Check</button>
                        <button class="btn-front-secondary" id="edit" data-id=${question.id}>Edit</button>
                    </div>
                </div>
            </div>
            <div class="back">
                <div class="close" id="delete-btn" data-id=${question.id}></div>
                <div class="content" id="front-content">
                    <h3>A:</h3>
                    <h4 id="answer">${question.answer}</h4>
                    <div class="buttons">
                        <button class="btn-primary" id="check" data-id=${question.id}>Check</button>
                        <button class="btn-secondary" id="edit" data-id=${question.id}>Edit</button>
                    </div>
                </div>
            </div>
        </div>
        `
        cardContainer.appendChild(card);
    }


    //addQuestion Helper: display a confirmation message
    /*var display = confirmMsg.style.display;
    display = "block";
    function showConfirm(){
        
    }

    function hideConfirm(){
        if(confirmMsg.classList.contains("reveal")){
            confirmMsg.classList.remove("reveal");
            confirmMsg.classList.add("hide");
        }
    }
*/
    //Delete a question (delete), Check answer, Edit flashcard
    //have card container continuously listen for a click
    cardContainer.addEventListener('click', function(e) {
        e.preventDefault();
        var cardBtn = e.target;
        if(e.target.id == "delete-btn"){
            //remove from DOM
            cardContainer.removeChild(cardBtn.parentElement.parentElement.parentElement);
            //remove from local storage
            //filters out all id's that aren't equal to the one being deleted
            var removeId = cardBtn.dataset.id;
            var newDeck = flashdeck.filter(function(question){
                return question.id != removeId;
            });
            flashdeck = newDeck;
            window.localStorage.setItem('flashdeck', JSON.stringify(flashdeck));
        } else if(e.target.id =="check") {
            var innerCard = cardBtn.parentElement.parentElement.parentElement.parentElement
            innerCard.classList.toggle("flipCard");
        } else if (e.target.id == "edit") {
            //remove from DOM
            cardContainer.removeChild(cardBtn.parentElement.parentElement.parentElement.parentElement.parentElement); 

            //fill in question form with correct fields
            var id = cardBtn.dataset.id;
            console.log(id);

            //get question clicked
            var question = flashdeck.filter(function(q){
                return q.id == id;
            })
            var questionField = document.getElementById('question');
            var answerField = document.getElementById('answer');
            questionField.value = question[0].question;
            answerField.value = question[0].answer;

            //remove question from local storage
            var newDeck = flashdeck.filter(function(q){
                return q.id != id;
            });
            window.localStorage.setItem('flashdeck', JSON.stringify(newDeck));
        }
    });


    
    
}

//create question/answer object
class Question {
    constructor(id, question, answer) {
        this.id=id;
        this.question=question;
        this.answer=answer;
    }
}

document.addEventListener("DOMContentLoaded", function() { 
    onPageLoad();
    // window.localStorage.clear();
});