

    //Entrar//
    const name = "TEstaEt1"
    const enterPromise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {name});
    
    enterPromise.then(test);
    enterPromise.catch(erro);

    function erro (erro){
        console.log(erro);

    }

    function test (teste){
        console.log (teste);
    }
    
    
