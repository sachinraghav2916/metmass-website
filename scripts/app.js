auth.onAuthStateChanged(user=>{
    if(user)
        {
            const loggedInLinks = document.querySelectorAll(".loggedIn");
            const loggedOutLinks = document.querySelectorAll(".loggedOut");
            const loggedInOut = document.querySelectorAll(".loggedInOut");
            
            loggedInOut.forEach(data => {
                data.style.display = 'block';
            })
            
            
            loggedInLinks.forEach(data => {
                data.style.display = 'block'
            })

            loggedOutLinks.forEach(data => {
                data.style.display = 'none';
            })
        }
    else {
        const loggedInOut = document.querySelectorAll(".loggedInOut");
        loggedInOut.forEach(data => {
            data.style.display = 'block';
        })

        const loggedInLinks = document.querySelectorAll(".loggedIn");
        const loggedOutLinks = document.querySelectorAll(".loggedOut");
        loggedInLinks.forEach(data => {
            data.style.display = 'none'
        })
        loggedOutLinks.forEach(data => {
            data.style.display = 'block';
        })
    }
})
