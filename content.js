let allowedToSee = false;


const hide = () => {
    const timeline = document.querySelector('[aria-label="Timeline: Your Home Timeline"]');

    if (timeline) {
        timeline.style.display =
            (!allowedToSee) ?
                'none' : 'block';
    }
}



function addMutationObserver() {
    // Add a listener to detect when the "Trending" sidebar appears,
    // and modify it:
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // mutation.target.querySelectorAll("div[aria-label='Timeline: Trending now']").forEach(replaceContent);
            mutation.target.querySelectorAll("div[aria-label='Trending']").forEach(replaceContent);
        });
    });
    observer.observe(document.body, { subtree: true, childList: true });
}

function replaceContent(e) {
    // This will be called when the "Trending" sidebar's element was detected.
    // First, check to see if we have already modified it:
    if (e.hasAttribute('arc-boosted')) { return; }
    e.setAttribute('arc-boosted', 'true');
    // e.innerText = ""

    let questions = document.createElement('div')
    questions.setAttribute('id', 'trivia-div')


    var enterBtn = document.createElement('input')
    enterBtn.setAttribute('id', 'enter-btn')
    enterBtn.setAttribute('type', 'button')
    enterBtn.setAttribute('value', 'Let me see twitter!!')

    var btnDiv = document.createElement('div')
    btnDiv.setAttribute('id', 'btn-div')
    btnDiv.appendChild(enterBtn)

    var questionsAreaDiv = document.createElement('div')
    questionsAreaDiv.setAttribute('id', 'q-a-div')
    questions.appendChild(questionsAreaDiv)
    questions.appendChild(btnDiv)
    e.appendChild(questions)


    const generateTrivia = async () => {
        let question_num = 3;
        let difficulty = 'easy'
        let url = 'https://opentdb.com/api.php?amount=' + question_num + '&difficulty=' + difficulty + '&type=multiple'
        const response = await fetch(url);
        const data = await response.json();
        questions = data["results"]
        // console.log(questions)
        triviaDiv = document.getElementById('q-a-div')

        let triviaQuestions = document.createElement('ul')
        triviaQuestions.setAttribute('id', 'trivia-questions')

        let q_id = 0
        questions.forEach((trivia) => {
            q_id++
            let triviaQ = document.createElement('li')
            let triviaQ_id = 'trivia-q' + q_id
            triviaQ.setAttribute('id', triviaQ_id)
            let question = decode(trivia["question"])

            let correct_answer = trivia["correct_answer"]

            let all_answers = trivia["incorrect_answers"]

            all_answers.push(correct_answer)
            // console.log(all_answers)
            // console.log(correct_answer)

            all_answers = shuffle(all_answers)

            triviaQ.innerText = decode(question);

            let triviaA = document.createElement('form')
            triviaA.setAttribute('id', 'trivia-ans')

            // console.log(all_answers)

            all_answers.forEach((option) => {

                let triviaOp = document.createElement('label')
                triviaOp.setAttribute('class', 'form-control')
                triviaOp.setAttribute('value', option)

                let triviaSpan = document.createElement('span')
                triviaSpan.innerText = decode(option)


                let triviaInner = document.createElement('input')
                let radio_name = 'radio' + q_id
                triviaInner.setAttribute('type', 'radio')
                triviaInner.setAttribute('value', option)
                triviaInner.setAttribute('name', radio_name)


                triviaOp.appendChild(triviaInner)
                triviaOp.appendChild(triviaSpan)
                triviaA.appendChild(triviaOp)
            }
            )


            triviaQ.innerText = question
            triviaQuestions.appendChild(triviaQ)
            triviaQuestions.appendChild(triviaA)

        }
        )

        triviaDiv.appendChild(triviaQuestions)


        let enterBtn = document.getElementById('enter-btn')
        console.log(enterBtn)
        enterBtn.onclick = (() => {
            let correct_answers = 0
            let total_question = questions.length
            let correct_radios = []
            questions.forEach((trivia) => {
                let correct_answer = trivia["correct_answer"]

                all_answers = [0, 1, 2, 3]
                let q_id = 0
                all_answers.forEach((option) => {
                    q_id++
                    let radio_name = 'radio' + q_id
                    let radios = document.getElementsByName(radio_name);

                    for (let i = 0, length = radios.length; i < length; i++) {
                        if (radios[i].checked) {
                            let selected_answer = radios[i].value
                            correct_radios.push(radios[i])
                            // console.log("selected answer: " + selected_answer + " correct answer: " + correct_answer)

                            if (selected_answer == correct_answer) {
                                correct_answers++
                            }
                        }
                    }
                })
            });

            alert("You got " + correct_answers + " out of " + total_question + " correct!")
            if (correct_answers / total_question >= (2 / 3)) {


                correct_radios.forEach((radio) => {
                    radio.parentElement.style.color = '#557153'
                    radio.parentElement.style.fontWeight = 'bold'
                    // radio.style.backgroundColor = '#557153'

                    // radio.style.color = '#557153'
                });

                setTimeout(hideTrivia, 2500);
                allowedToSee = true
            }
        });

    };

    generateTrivia();
}

function hideTrivia() {
    let hideTrivia = document.getElementById('trivia-div')
    hideTrivia.style.display = 'none'
    setLastTweetTime()
}



function decode(str) {

    let txt = document.createElement("textarea");

    txt.innerHTML = str;

    return txt.value;

}



// Start watching the page for changes:
addMutationObserver();


function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function currentDateString() {
    const now = new Date();
    return `${now.getMonth()}/${now.getDay()}/${now.getFullYear()}`
}

setInterval(hide, 1000)