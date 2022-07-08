import * as constants from "/constants.js"

constants.FLEXSWITCHDEFAULT.addEventListener('click', modeSwitch);
constants.DELETE_ALL.addEventListener('click', deleteAllSessions);
constants.CREATESESSION.addEventListener('click', saveSession)


if (localStorage.getItem("Sessions_Saver_Ext")) {
    let masterObject = localStorage.getItem("Sessions_Saver_Ext")
    let masterObjectArray = JSON.parse(masterObject)

    if (masterObjectArray.length > 0) {
        numOfSessions()
        displaySession()
    }
    else {
        let disupe = `<p class="d-flex justify-content-center align-items-center numOfSessions">You have no saved Sessions</p>`
        constants.SESSIONS_COUNT.innerHTML = disupe
    }

} else {
    let masterObjectCreator = []
    localStorage.setItem("Sessions_Saver_Ext", JSON.stringify(masterObjectCreator));
}


function numOfSessions() {
    let the_Count = JSON.parse(localStorage.getItem('Sessions_Saver_Ext'))
    let totalSessionsSaved = the_Count.length
    if (totalSessionsSaved > 1) {
        let showCount = `
        <p class="d-flex justify-content-center align-items-center numOfSessions">You have ${totalSessionsSaved} Sessions saved.</p>
    `
        return constants.SESSIONS_COUNT.innerHTML = showCount

    } else if (totalSessionsSaved === 1) {
        let showCount = `
        <p class="d-flex justify-content-center align-items-center numOfSessions">You have ${totalSessionsSaved} Session saved.</p>
    `
        return constants.SESSIONS_COUNT.innerHTML = showCount

    } else {
        let showCount = `
        <p class="d-flex justify-content-center align-items-center numOfSessions">You have ${totalSessionsSaved} Sessions saved.</p>
    `
        return constants.SESSIONS_COUNT.innerHTML = showCount
    }

}

window.addEventListener("DOMContentLoaded", function () {
    checkModeSwitch()
    launchSession()

});

async function saveSession() {

    // ***************FETCH SESSION***********************************
    let windowTabs = []
    let current_Tabs = await chrome.tabs.query({ currentWindow: true })
    current_Tabs.forEach(element => {
        let one_Tab = { webpage_title: element.title, webpage_url: element.url, webpage_favicon: element.favIconUrl }
        windowTabs.push(one_Tab)
    })

    // ***************ADD THE SESSION TO LOCAL STORAGE*****************

    let masterObject = localStorage.getItem('Sessions_Saver_Ext')
    let masterObjectArray = JSON.parse(masterObject)
    masterObjectArray.push(windowTabs)
    localStorage.setItem('Sessions_Saver_Ext', JSON.stringify(masterObjectArray))

    // ***************DISPLAY LOCAL-STORAGE DATA***********************
    numOfSessions()
    displaySession()
    launchSession()
    modeSwitch()
}


function launchSession() {

    let sessionBtnList = document.querySelectorAll('.Session-Btn');
    let sessionsBtnsMapped = [...sessionBtnList]
    sessionsBtnsMapped.forEach(element => {
        element.addEventListener('click', function () {
            let sessionNdex = sessionsBtnsMapped.indexOf(element)
            let masterObjectArray = JSON.parse(localStorage.getItem('Sessions_Saver_Ext'))
            masterObjectArray.forEach(tablist => {
                if(sessionNdex === masterObjectArray.indexOf(tablist)) {
                    tablist.forEach(tab => {
                        if (tablist.indexOf(tab) === 0) {
                            chrome.windows.create({ url: tab.webpage_url, state: 'maximized' })
                        }
                        else {
                            window.open(tab.webpage_url)
                        }
                    })
                }
            })
        })
    })
}

function displaySession() {

    let currentSessions = JSON.parse(localStorage.getItem('Sessions_Saver_Ext'))

    if (currentSessions && currentSessions.length > 0) {
        let sessionID = 1
        let button_Renders_List = []
        currentSessions.forEach((element) => {
            let buttonRender = `<li class="list-group-item d-flex justify-content-between align-items-center mb-2">
        <a href="#" class="btn btn-success Session-Btn mx-2">
        Session ${sessionID++} </a>
        
        <button type="button" id="delete-btn" class="btn btn-danger mx-2">
        <img src="Trash.svg" alt="" width="20" height="20" class="d-inline-block align-text-justify">
        </button></li>`
            return button_Renders_List.push(buttonRender)
        })
        constants.SESSIONS_BTNS_RENDERS.innerHTML = button_Renders_List.join("")
        deleteSession()
    } else {
        constants.SESSIONS_BTNS_RENDERS.innerHTML = []
        numOfSessions()
    }
};

function deleteSession() {

    const DELETE_ONE = document.querySelectorAll(".list-group-item")
    let theDeletables = []
    DELETE_ONE.forEach(element => {
        let deleteBtn = element.querySelector('#delete-btn')
        deleteBtn.addEventListener('click', function () {
            let deleteNdex = theDeletables.push(deleteBtn)
            let masterObjectArray = JSON.parse(localStorage.getItem('Sessions_Saver_Ext'))
            masterObjectArray.splice(deleteNdex - 1, 1)
            localStorage.setItem('Sessions_Saver_Ext', JSON.stringify(masterObjectArray))
            numOfSessions()
            displaySession()
            launchSession()
            modeSwitch()
        })
    })
}

function deleteAllSessions() {
    localStorage.removeItem('Sessions_Saver_Ext')
    localStorage.setItem('Sessions_Saver_Ext', '[]')
    displaySession()
    modeSwitch()
}

function checkModeSwitch() {
    const SWITCH = localStorage.getItem('flexSwitch')
    if (SWITCH === 'on') {
        darkModeOn();
        constants.FLEXSWITCHDEFAULT.click()
    }
}

function modeSwitch() {
    if (constants.FLEXSWITCHDEFAULT.checked) {
        darkModeOn();
    } else {
        darkModeOff();
    }
}

function darkModeOn() {
    localStorage.setItem('flexSwitch', 'on')
    localStorage.setItem('mode', 'dark');
    document.body.classList.add("dark-mode");
    document.body.querySelector('.numOfSessions').classList.add('text-white')
    document.body.querySelector('.list-group').classList.add('sessionsUL')
    const SESSIONSBTNs = document.body.querySelectorAll('.list-group-item')
    for (let i = 0; i < SESSIONSBTNs.length; i++) {
        SESSIONSBTNs[i].classList.add('sessionsBTNs')
    }
}

function darkModeOff() {
    localStorage.setItem('flexSwitch', 'off')
    localStorage.setItem('mode', 'light');
    document.body.classList.remove("dark-mode");
    document.body.querySelector('.numOfSessions').classList.remove('text-white')
    document.body.querySelector('.list-group').classList.remove('sessionsUL')
    const SESSIONSBTNs = document.body.querySelectorAll('.list-group-item')
    for (let i = 0; i < SESSIONSBTNs.length; i++) {
        SESSIONSBTNs[i].classList.remove('sessionsBTNs')
    }
}