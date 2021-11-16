// entrar
const namePerson =  prompt("Digite um novo nome");
const enterPromise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {name: namePerson});
let reloadMessage = 1;

enterPromise.then(enterOnline);
enterPromise.catch(error);

function enterOnline(promisse){
    setTimeout(stillOnline, 5000)
    // manter online
    function stillOnline() {
        axios.post("https://mock-api.driven.com.br/api/v4/uol/status", {name: namePerson})

        setTimeout(stillOnline, 5000);
    }
    getMessages ();
    //opcional
    reloadParticipants();
}

//caso ocorra erro
function error (erro){
    console.log(erro.response.status)
    if (erro.response.status === 400){
        namePerson = prompt("Nome em uso, digite um novo nome");
    } 
    const enterPromise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {name: namePerson});
    enterPromise.then(enterOnline);
    enterPromise.catch(error);
}

//carregando as mensagens
function getMessages() {
    const messagePromise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");

    messagePromise.then(promisesMessage);

    function promisesMessage(response) {
        displayMessages(response);
        if (reloadMessage > 0) {
            setTimeout(getMessages, 3000);
        } else {
            reloadMessage++;
        }
    }

    function displayMessages(response){
        const printMessage = document.getElementById("content");
        printMessage.innerHTML = '';
        for(let i =0; i < 100; i++) {
            if(response.data[i].type === 'message') {
                printMessage.innerHTML +=
                `<div class="message message-everyone" data-identifier="message">
                    <p>
                        <span>(${response.data[i].time}) </span>
                        <strong>${response.data[i].from} </strong>
                        para <strong>${response.data[i].to}: </strong>
                        ${response.data[i].text}
                    </p>
                </div>`
            } else if(response.data[i].type === 'status') {
                printMessage.innerHTML +=
                `<div class="message message-status" data-identifier="message">
                    <p>
                        <span>(${response.data[i].time}) </span>
                        <strong>${response.data[i].from} </strong>
                        ${response.data[i].text}
                    </p>
                </div>`
            } else if(response.data[i].type === 'private_message' && response.data[i].to === namePerson) {
                printMessage.innerHTML +=
                `<div class="message message-private" data-identifier="message">
                    <p>
                        <span>(${response.data[i].time}) </span>
                        <strong>${response.data[i].from} </strong>
                        reservadamente para <strong>${response.data[i].to}: </strong>
                        ${response.data[i].text}
                    </p>
                </div>`
            }

            if (i === 99) { 
                let div = document.getElementById('content');
                let divLast = div.lastChild;
                divLast.scrollIntoView();
            }
        }
    }
}

//enviando mensagem
function sendMessage() {
    const text = document.getElementById('sendMessage');
    if (text.value !== ''){ 
        const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', { from: namePerson, to: "todos", text: text.value, type: 'message'})

        promise.then(promisseSend);
        promise.catch(function (){
            window.location.reload()
        });
        text.value = '';

        function promisseSend(response) {
            reloadMessage=0;
            getMessages();
        }
    }
}

// critério opicional participantes 
function showList (){
    const nav = document.getElementById("nav");
    nav.classList.toggle("hidden");
}

function reloadParticipants (){
    const theParticipants = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants');
    theParticipants.then(listParticipants);
    
    function listParticipants (response){
        console.log(response);
        const printParticipant = document.querySelector(".participants");
        for(let i=0; i <response.data.length ; i++){
            printParticipant.innerHTML += 
            `<div>
                <ion-icon name="person-circle"></ion-icon>
                <p>${response.data[i].name}</p>
            </div>`
        }
    }
}
