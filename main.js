


    // entrar
    const namePerson =  prompt("Digite um novo nome");
    const enterPromise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {name: namePerson});
    let reloadMessage = 1;
    
    enterPromise.then(enterOnline);
    enterPromise.catch(error);

    
    function enterOnline(promisse){
        
        // manter online
        setTimeout(stillOnline, 5000)
        function stillOnline() {
            axios.post("https://mock-api.driven.com.br/api/v4/uol/status", {name: namePerson})
            // const onlinePromise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", {name: namePerson})
            // onlinePromise.then(test)
            
            // function test(response) {
            //     console.log("Check");
            // }
    
            setTimeout(stillOnline, 5000);
        }

        getMessages ();
    }
    
    function error (erro){
        console.log(erro.response.status)
        if (erro.response.status === 400){
            namePerson = prompt("Nome em uso, digite um novo nome");
        } 

        const enterPromise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {name: namePerson});

        enterPromise.then(enterOnline);
        enterPromise.catch(error);
    }

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
    