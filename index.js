const input = document.querySelector('.search');
const searchBlock = document.querySelector('.search-block');
const resultBlock = document.querySelector('.result-list');
const searchList = document.querySelector('.list');

let repositories = [];

async function searchRep() {
    if (input.value.trim() !== '') {
        return await fetch(`https://api.github.com/search/repositories?q=${input.value}&per_page=${5}`)
            .then(response => {
                if(response.ok) {
                    response.json().then(listResult)
                } else {
                    throw new Error('Error response, try correct input value again');
                }
            })
    } else {
        clearSearchList(); // if input.value empty
    }
}

function deBounce(func, timeout) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

function createElem(tag, classTag, text, id = null) {
    const el = document.createElement(tag);
    if (classTag) el.classList.add(classTag);
    if (text) el.textContent = text;
    if (id) el.id = id;
    return el;
}

function listResult(response) {
    if (input.value) {
        clearSearchList();
        response.items.forEach((e, id) => {
            let elem = createElem('li', 'list__item', e['name'], e['id']);
            searchList.append(elem);
            repositories.push(e);
        });
        console.log(repositories);
    }
}

function clearSearchList() {
    searchList.innerHTML = '';
    repositories = [];
}

function selectRep(repos) {
    let liResItem = createElem('li', 'result-list__item', '', repos['id']);
    let infoList = createElem('ul', 'info-list');
    let elemName = createElem('li', 'items', `Name: ${repos['name']}`);
    infoList.append(elemName);
    let elemOwner = createElem('li', 'items', `Owner: ${repos['owner']["login"]}`);
    infoList.append(elemOwner);
    let elemStars = createElem('li', 'items', `Stars: ${repos["stargazers_count"]}`);
    infoList.append(elemStars);
    let closeButton = createElem('button', 'close-button');
    liResItem.append(infoList);
    liResItem.append(closeButton);
    resultBlock.append(liResItem);
}

input.addEventListener('keyup', deBounce(searchRep, 600));

searchBlock.addEventListener('click', (event) => {
    repositories.forEach((e) => {
        if (event.target.id == e['id']) {
            selectRep(e); // add card result
            input.value = '';
            clearSearchList(); // clear search list
        }
    })
})

resultBlock.addEventListener('click', function (event) { // close result card
    if (event.target.closest('.close-button') || event.target.classList.contains('close-button')) {
        event.target.parentElement.remove();
    }
})
